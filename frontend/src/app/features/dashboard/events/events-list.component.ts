import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matAdd, matArrowBack, matDelete, matEdit, matEvent, matLocalActivity } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserResponse } from '../../../models/user.model';
import { EventsService } from '../../../services/events/events.service';
import { TicketsService } from '../../../services/tickets/tickets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-events-list',
  imports: [RouterLink, NgIcon, DashboardNavbarComponent, DatePipe],
  templateUrl: './events-list.component.html',
  providers: [
    provideIcons({ matEvent, matEdit, matDelete, matAdd, matArrowBack, matLocalActivity })
  ]
})
export class EventsListComponent implements OnInit {
  readonly currentUser = signal<UserResponse>({} as UserResponse);
  readonly events = signal<any[]>([]);
  readonly loading = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
    private ticketsService: TicketsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.authService.logout();
      return;
    }
    this.currentUser.set(user);
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading.set(true);
    this.eventsService.getEvents().subscribe({
      next: (list) => {
        let events = list || [];
        if (this.isUser()) {
          events = (events || []).filter((e: any) => e?.status === 'published');
        }
        this.events.set(events);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Fehler beim Laden der Events. Bitte versuche es erneut.', 'Laden fehlgeschlagen');
        this.loading.set(false);
      }
    });
  }

  onDelete(event: any): void {
    const name = event?.name || 'Event';
    const confirmed = confirm(`Möchtest du "${name}" wirklich löschen?`);
    if (!confirmed) {return;}
    this.eventsService.deleteEvent(event.id as number).subscribe({
      next: () => {
        this.toastr.success(`"${name}" wurde gelöscht.`, 'Gelöscht');
        this.fetchEvents();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Event konnte nicht gelöscht werden.', 'Fehler');
      }
    });
  }

  buyTicket(event: any): void {
    if (!event?.id) {
      this.toastr.error('Ungültiges Event.', 'Fehler');
      return;
    }
    this.ticketsService.createTicket({ eventId: event.id }).subscribe({
      next: () => {
        this.toastr.success(`Ticket für "${event.name || 'Event'}" wurde gekauft.`, 'Ticket gekauft');
      },
      error: (err) => {
        this.toastr.error(err?.message || 'Ticket konnte nicht erstellt werden.', 'Fehler');
      }
    });
  }

  isUser(): boolean {
    const role = (this.currentUser()?.role || '').toLowerCase();
    return role === 'user';
  }

  getRoleDisplayName(): string {
    return this.authService.getRoleDisplayName();
  }
}