import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBack, matLocalActivity, matQrCode2, matSync } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketsService } from '../../../services/tickets/tickets.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-ticket-qr',
  standalone: true,
  imports: [RouterLink, NgIcon, DashboardNavbarComponent],
  providers: [
    provideIcons({ matLocalActivity, matArrowBack, matQrCode2, matSync })
  ],
  templateUrl: './ticket-qr.component.html'
})
export class TicketQrComponent implements OnInit {
  readonly currentUser = signal<any | null>(null);
  readonly loading = signal<boolean>(true);
  readonly generating = signal<boolean>(false);
  readonly ticket = signal<any | null>(null);
  readonly qrDataUrl = signal<string>('');

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
    if (!t?.uuid) {return;}
    this.generating.set(true);
    try {
      const dataUrl = await QRCode.toDataURL(t.uuid, { width: 512, margin: 2 });
      this.qrDataUrl.set(dataUrl);
    } finally {
      this.generating.set(false);
    }
  }

  getRoleDisplayName(): string {
    return this.authService.getRoleDisplayName();
  }
}