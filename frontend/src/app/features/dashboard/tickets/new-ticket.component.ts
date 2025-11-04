import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLocalActivity, matAdd, matArrowBack, matSave, matSync } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserResponse } from '../../../models/user.model';
import { UsersService } from '../../../services/users/users.service';
import { EventsService } from '../../../services/events/events.service';
import { TicketsService } from '../../../services/tickets/tickets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-ticket',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, DashboardNavbarComponent],
  templateUrl: './new-ticket.component.html',
  providers: [
    provideIcons({ matLocalActivity, matAdd, matArrowBack, matSave })
  ]
})
export class NewTicketComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  form!: FormGroup;
  saving = false;
  events = signal<any[]>([]);
  users = signal<UserResponse[]>([]);

  constructor(
    private fb: FormBuilder,
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

    const isUser = (user.role || '').toLowerCase() === 'user';
    this.form = this.fb.group({
      eventId: [null, [Validators.required]],
      userId: [isUser ? user.id : null, [Validators.required]],
      status: [isUser ? 'active' : 'active', [Validators.required]],
      usedAt: ['']
    });

    this.fetchEventsAndUsers();
  }

  fetchEventsAndUsers(): void {
    const role = (this.currentUser()?.role || '').toLowerCase();
    this.eventsService.getEvents().subscribe({
      next: (list) => {
        let events = list || [];
        if (role === 'user') {
          events = (events || []).filter((e: any) => e?.status === 'published');
        }
        this.events.set(events);
      },
      error: () => this.toastr.error('Events konnten nicht geladen werden.', 'Fehler')
    });

    if (role !== 'user') {
      this.usersService.getUsers().subscribe({
        next: (list) => this.users.set(list || []),
        error: () => this.toastr.error('Benutzer konnten nicht geladen werden.', 'Fehler')
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const { eventId, userId, status, usedAt } = this.form.value;
    const role = (this.currentUser()?.role || '').toLowerCase();
    const currentUserId = this.currentUser().id;
    const payload: any = {
      eventId: Number(eventId),
      userId: role === 'user' ? Number(currentUserId) : Number(userId),
      status: role === 'user' ? 'active' : status
    };
    if (usedAt && role !== 'user') {
      const iso = new Date(usedAt).toISOString();
      payload.usedAt = iso;
    }

    this.ticketsService.createTicket(payload).subscribe({
      next: () => {
        const evt = this.events().find(e => (e?.id ?? e?.eventId) === Number(eventId));
        const name = evt?.name || 'Event';
        this.toastr.success(`Ticket für "${name}" wurde erstellt.`, 'Ticket erstellt');
        this.saving = false;
        this.router.navigate(['/dash/tickets']);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Ticket konnte nicht erstellt werden.', 'Fehler');
        this.saving = false;
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

  getRoleDisplayName(): string {
    return this.authService.getRoleDisplayName();
  }

  isUser(): boolean {
    const role = (this.currentUser()?.role || '').toLowerCase();
    return role === 'user';
  }
}