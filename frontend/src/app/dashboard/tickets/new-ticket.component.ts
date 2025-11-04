import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLocalActivity, matAdd, matArrowBack, matSave, matSync } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../auth/auth.interface';
import { UsersService } from '../../users/users.service';
import { EventsService } from '../../events/events.service';
import { TicketsService } from '../../tickets/tickets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-ticket',
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink, NgIcon, DashboardNavbarComponent],
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

    this.form = this.fb.group({
      eventId: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      status: ['active', [Validators.required]],
      usedAt: ['']
    });

    this.fetchEventsAndUsers();
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const { eventId, userId, status, usedAt } = this.form.value;
    const payload: any = { eventId: Number(eventId), userId: Number(userId), status };
    if (usedAt) {
      const iso = new Date(usedAt).toISOString();
      payload.usedAt = iso;
    }

    this.ticketsService.createTicket(payload).subscribe({
      next: () => {
        this.toastr.success('Ticket wurde erstellt.', 'Erfolgreich');
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