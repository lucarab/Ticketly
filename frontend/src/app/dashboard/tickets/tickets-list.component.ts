import { Component, OnInit, signal } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLocalActivity, matDelete, matArrowBack, matCheckCircle, matEdit, matAdd, matQrCode2 } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../auth/auth.interface';
import { TicketsService } from '../../tickets/tickets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tickets-list',
  imports: [NgIf, NgFor, RouterLink, NgIcon, DashboardNavbarComponent, DatePipe],
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
        this.tickets.set(list || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Tickets konnten nicht geladen werden.', 'Fehler');
        this.loading.set(false);
      }
    });
  }

  onDelete(id: number): void {
    const confirmed = confirm('Möchtest du dieses Ticket wirklich löschen?');
    if (!confirmed) return;
    this.ticketsService.deleteTicket(id).subscribe({
      next: () => {
        this.toastr.success('Ticket wurde gelöscht.', 'Gelöscht');
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
        this.toastr.success('Ticket als verwendet markiert.', 'Aktualisiert');
        this.fetchTickets();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Ticket konnte nicht aktualisiert werden.', 'Fehler');
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