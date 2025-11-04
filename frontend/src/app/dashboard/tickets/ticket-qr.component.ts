import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLocalActivity, matArrowBack, matQrCode2, matSync } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { TicketsService } from '../../tickets/tickets.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-ticket-qr',
  standalone: true,
  imports: [NgIf, RouterLink, NgIcon, DashboardNavbarComponent],
  providers: [
    provideIcons({ matLocalActivity, matArrowBack, matQrCode2, matSync })
  ],
  templateUrl: './ticket-qr.component.html'
})
export class TicketQrComponent implements OnInit {
  currentUser = signal<any | null>(null);
  loading = signal<boolean>(true);
  generating = signal<boolean>(false);
  ticket = signal<any | null>(null);
  qrDataUrl = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private ticketsService: TicketsService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.authService.logout();
      return;
    }
    this.currentUser.set(user);

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!id || isNaN(id)) {
      this.router.navigate(['/dash/tickets']);
      return;
    }

    this.ticketsService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket.set(t);
        this.loading.set(false);
        this.generateQr();
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/dash/tickets']);
      }
    });
  }

  async generateQr(): Promise<void> {
    const t = this.ticket();
    if (!t?.uuid) return;
    this.generating.set(true);
    try {
      const dataUrl = await QRCode.toDataURL(t.uuid, { width: 512, margin: 2 });
      this.qrDataUrl.set(dataUrl);
    } finally {
      this.generating.set(false);
    }
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