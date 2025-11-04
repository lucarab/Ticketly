import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLocalActivity, matEdit, matArrowBack, matSave, matSync } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../auth/auth.interface';
import { UsersService } from '../../users/users.service';
import { EventsService } from '../../events/events.service';
import { TicketsService } from '../../tickets/tickets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-ticket',
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink, NgIcon, DashboardNavbarComponent],
  templateUrl: './edit-ticket.component.html',
  providers: [
    provideIcons({ matLocalActivity, matEdit, matArrowBack, matSave, matSync })
  ]
})
export class EditTicketComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  form!: FormGroup;
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  events = signal<any[]>([]);
  users = signal<UserResponse[]>([]);
  ticketId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private usersService: UsersService,
    private eventsService: EventsService,
    private ticketsService: TicketsService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.authService.logout();
      return;
    }
    this.currentUser.set(user);

    this.form = this.fb.group({
      eventId: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      status: ['active', [Validators.required]],
      usedAt: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.ticketId = Number(idParam);

    this.fetchEventsAndUsers();
    this.loadTicket();
  }

  fetchEventsAndUsers(): void {
    this.eventsService.getEvents().subscribe({
      next: (list) => this.events.set(list || []),
      error: () => this.toastr.error('Events konnten nicht geladen werden.', 'Fehler')
    });

    this.usersService.getUsers().subscribe({
      next: (list) => this.users.set(list || []),
      error: () => this.toastr.error('Benutzer konnten nicht geladen werden.', 'Fehler')
    });
  }

  loadTicket(): void {
    this.ticketsService.getTicketById(this.ticketId).subscribe({
      next: (ticket) => {
        if (!ticket) {
          this.toastr.error('Ticket nicht gefunden.', 'Fehler');
          this.router.navigate(['/dash/tickets']);
          return;
        }
        const usedAtLocal = this.toLocalDatetime(ticket.usedAt);
        this.form.patchValue({
          eventId: ticket.event?.id ?? ticket.eventId,
          userId: ticket.user?.id ?? ticket.userId,
          status: ticket.status || 'active',
          usedAt: usedAtLocal
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Ticket konnte nicht geladen werden.', 'Fehler');
        this.router.navigate(['/dash/tickets']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.form.markAllAsTouched();
    this.saving.set(true);
    const { eventId, userId, status, usedAt } = this.form.value;
    const payload: any = { eventId: Number(eventId), userId: Number(userId), status };
    if (usedAt) {
      payload.usedAt = new Date(usedAt).toISOString();
    }

    this.ticketsService.updateTicket(this.ticketId, payload).subscribe({
      next: () => {
        this.toastr.success('Ticket wurde aktualisiert.', 'Erfolgreich');
        this.saving.set(false);
        this.router.navigate(['/dash/tickets']);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Ticket konnte nicht aktualisiert werden.', 'Fehler');
        this.saving.set(false);
      }
    });
  }

  hasFieldError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control) return '';
    if (control.hasError('required')) return 'Dieses Feld ist erforderlich.';
    return 'Ungültige Eingabe.';
  }

  toLocalDatetime(iso?: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const ii = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${ii}`;
  }

  getRoleDisplayName(): string {
    const user = this.authService.getCurrentUser();
    const role = user?.role?.toLowerCase();
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Event Manager';
      case 'user':
        return 'Benutzer';
      default:
        return role || '';
    }
  }
}