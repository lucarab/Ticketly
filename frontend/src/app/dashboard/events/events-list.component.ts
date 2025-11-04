import { Component, OnInit, signal } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matEvent, matEdit, matDelete, matAdd, matArrowBack } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../auth/auth.interface';
import { EventsService } from '../../events/events.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-events-list',
  imports: [NgIf, NgFor, RouterLink, NgIcon, DashboardNavbarComponent, DatePipe],
  templateUrl: './events-list.component.html',
  providers: [
    provideIcons({ matEvent, matEdit, matDelete, matAdd, matArrowBack })
  ]
})
export class EventsListComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  events = signal<any[]>([]);
  loading = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
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
        this.events.set(list || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Events konnten nicht geladen werden.', 'Fehler');
        this.loading.set(false);
      }
    });
  }

  onDelete(id: number): void {
    const confirmed = confirm('Möchtest du dieses Event wirklich löschen?');
    if (!confirmed) return;
    this.eventsService.deleteEvent(id).subscribe({
      next: () => {
        this.toastr.success('Event wurde gelöscht.', 'Gelöscht');
        this.fetchEvents();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Event konnte nicht gelöscht werden.', 'Fehler');
      }
    });
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