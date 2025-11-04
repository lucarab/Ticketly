import { Component, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserResponse } from '../../../models/user.model';
import { UsersService } from '../../../services/users/users.service';
import { EventsService } from '../../../services/events/events.service';
import { TicketsService } from '../../../services/tickets/tickets.service';

import {
  matBarChart,
  matDashboard,
  matEvent,
  matLocalActivity,
  matLogout,
  matPerson,
  matQrCodeScanner,
  matSettings
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-manager-home',
  imports: [NgIcon, RouterLink, DashboardNavbarComponent],
  templateUrl: './manager-home.component.html',
  providers: [
    provideIcons({
      matDashboard,
      matLogout,
      matPerson,
      matEvent,
      matQrCodeScanner,
      matSettings,
      matLocalActivity,
      matBarChart
    })
  ]
})
export class ManagerHomeComponent implements OnInit {
  readonly currentUser = signal<UserResponse>({} as UserResponse);
  readonly usersCount = signal<number>(0);
  readonly eventsCount = signal<number>(0);
  readonly ticketsCount = signal<number>(0);
  readonly publishedEventsCount = signal<number>(0);

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
}