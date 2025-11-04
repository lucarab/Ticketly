import { Component, signal, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserResponse } from '../../../models/user.model';
import { UsersService } from '../../../services/users/users.service';
import { EventsService } from '../../../services/events/events.service';
import { TicketsService } from '../../../services/tickets/tickets.service';

import {
  matDashboard,
  matLogout,
  matPerson,
  matEvent,
  matQrCodeScanner,
  matSettings,
  matLocalActivity,
  matBarChart
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-user-home',
  imports: [NgIcon, RouterLink, DashboardNavbarComponent],
  templateUrl: './user-home.component.html',
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
export class UserHomeComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  eventsCount = signal<number>(0);
  purchasedTicketsCount = signal<number>(0);
  upcomingEventsCount = signal<number>(0);
  openTicketsCount = signal<number>(0);

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

    this.eventsService.getEventsCount().subscribe({
      next: (count) => this.eventsCount.set(count),
      error: (err) => console.error('Fehler beim Laden der Eventanzahl:', err)
    });

    this.eventsService.getEvents().subscribe({
      next: (events) => {
        const nowTs = Date.now();
        const count = (events || []).filter((e: any) => {
          const dt = e?.datetime ? new Date(e.datetime).getTime() : 0;
          const isFuture = dt > nowTs;
          const isPublished = e?.status === 'published';
          return isFuture && isPublished;
        }).length;
        this.upcomingEventsCount.set(count);
      },
      error: (err) => console.error('Fehler beim Laden der bevorstehenden Events:', err)
    });

    this.ticketsService.getTickets().subscribe({
      next: (tickets) => {
        const u = this.currentUser();
        const uid = u?.id;
        const owned = (tickets || []).filter((t: any) => t?.userId === uid || t?.User?.id === uid || t?.user?.id === uid);
        const purchased = owned.length;
        const used = owned.filter((t: any) => !!t?.usedAt).length;
        const open = Math.max(purchased - used, 0);
        this.purchasedTicketsCount.set(purchased);
        this.openTicketsCount.set(open);
      },
      error: (err) => console.error('Fehler beim Laden der Benutzertickets:', err)
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