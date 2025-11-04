import { Component, signal, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../auth/auth.interface';
import { UsersService } from '../../users/users.service';
import { EventsService } from '../../events/events.service';
import { TicketsService } from '../../tickets/tickets.service';

import { 
  matDashboard,
  matLogout,
  matPerson,
  matEvent,
  matAnalytics,
  matSettings,
  matLocalActivity,
  matBarChart
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-dashboard-home',
  imports: [NgIcon, RouterLink, DashboardNavbarComponent],
  templateUrl: './home.component.html',
  providers: [
    provideIcons({ 
      matDashboard,
      matLogout,
      matPerson,
      matEvent,
      matAnalytics,
      matSettings,
      matLocalActivity,
      matBarChart
    })
  ]
})
export class HomeComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  usersCount = signal<number>(0);
  eventsCount = signal<number>(0);
  ticketsCount = signal<number>(0);
  publishedEventsCount = signal<number>(0);

  constructor(
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

    this.usersService.getUsersCount().subscribe({
      next: (count) => this.usersCount.set(count),
      error: (err) => console.error('Fehler beim Laden der Benutzeranzahl:', err)
    });

    this.eventsService.getEventsCount().subscribe({
      next: (count) => this.eventsCount.set(count),
      error: (err) => console.error('Fehler beim Laden der Eventanzahl:', err)
    });

    this.eventsService.getPublishedEventsCount().subscribe({
      next: (count) => this.publishedEventsCount.set(count),
      error: (err) => console.error('Fehler beim Laden der aktiven Events:', err)
    });

    this.ticketsService.getTicketsCount().subscribe({
      next: (count) => this.ticketsCount.set(count),
      error: (err) => console.error('Fehler beim Laden der Ticketanzahl:', err)
    });
  }

  getGreeting(): string {
    const user = this.currentUser();
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) {
      timeGreeting = 'Guten Morgen';
    } else if (hour < 18) {
      timeGreeting = 'Guten Tag';
    } else {
      timeGreeting = 'Guten Abend';
    }
    
    return `${timeGreeting}, ${user.firstname}!`;
  }

  getRoleDisplayName(): string {
    const user = this.currentUser();
    switch (user.role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Event Manager';
      case 'user':
        return 'Benutzer';
      default:
        return user.role;
    }
  }
}
