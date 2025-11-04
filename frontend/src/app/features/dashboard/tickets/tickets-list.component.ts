import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLocalActivity, matDelete, matArrowBack, matCheckCircle, matEdit, matAdd, matQrCode2 } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserResponse } from '../../../models/user.model';
import { TicketsService } from '../../../services/tickets/tickets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tickets-list',
  imports: [RouterLink, NgIcon, DashboardNavbarComponent, DatePipe],
  templateUrl: './tickets-list.component.html',
  providers: [
    provideIcons({ matLocalActivity, matDelete, matArrowBack, matCheckCircle, matEdit, matAdd, matQrCode2 })
  ]
})
export class TicketsListComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  tickets = signal<any[]>([]);
  loading = signal<boolean>(false);

  constructor(
    private authService: AuthService,
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
    this.fetchTickets();
  }

  fetchTickets(): void {
    this.loading.set(true);
    this.ticketsService.getTickets().subscribe({
      next: (list) => {
        let tickets = list || [];
        if (this.isUser()) {
          const uid = this.currentUser()?.id;
          tickets = (tickets || []).filter((t: any) => t?.userId === uid);
        }
        this.tickets.set(tickets);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Fehler beim Laden der Tickets. Bitte versuche es erneut.', 'Laden fehlgeschlagen');
        this.loading.set(false);
      }
    });
  }

  onDelete(ticket: any): void {
    const eventName = ticket?.event?.name || 'Ticket';
    const confirmed = confirm(`Möchtest du das Ticket für "${eventName}" wirklich löschen?`);
    if (!confirmed) return;
    this.ticketsService.deleteTicket(ticket.id as number).subscribe({
      next: () => {
        this.toastr.success(`Ticket für "${eventName}" wurde gelöscht.`, 'Ticket gelöscht');
        this.fetchTickets();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Ticket konnte nicht gelöscht werden.', 'Fehler');
      }
    });
  }

  markAsUsed(ticket: any): void {
    if (ticket?.status === 'used') return;
    this.ticketsService.updateTicket(ticket.id, {
      status: 'used',
      usedAt: new Date().toISOString()
    }).subscribe({
      next: () => {
        const eventName = ticket?.event?.name || 'Event';
        this.toastr.success(`Ticket für "${eventName}" als verwendet markiert.`, 'Ticket aktualisiert');
        this.fetchTickets();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Ticket konnte nicht aktualisiert werden.', 'Fehler');
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