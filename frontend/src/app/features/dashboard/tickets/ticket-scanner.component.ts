import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBack, matCheckCircle, matErrorOutline, matQrCodeScanner, matSync } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketsService } from '../../../services/tickets/tickets.service';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';

@Component({
  selector: 'app-ticket-scanner',
  standalone: true,
  imports: [RouterLink, NgIcon, DashboardNavbarComponent],
  providers: [
    provideIcons({ matQrCodeScanner, matArrowBack, matCheckCircle, matErrorOutline, matSync })
  ],
  templateUrl: './ticket-scanner.component.html'
})
export class TicketScannerComponent implements OnInit, OnDestroy {
  @ViewChild('preview', { static: true }) previewRef!: ElementRef<HTMLVideoElement>;

  readonly currentUser = signal<any | null>(null);
  readonly scanning = signal<boolean>(false);
  readonly resultValid = signal<boolean | null>(null);
  readonly resultReason = signal<string>('');
  readonly scannedUuid = signal<string>('');
  readonly manualUuid = signal<string>('');

  private controls: IScannerControls | null = null;
  private reader = new BrowserMultiFormatReader();

  constructor(
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
    this.startScanner();
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  async startScanner(): Promise<void> {
    this.scanning.set(true);
    this.resultValid.set(null);
    this.resultReason.set('');
    this.scannedUuid.set('');
    try {
      this.controls = await this.reader.decodeFromVideoDevice(undefined, this.previewRef.nativeElement, (result, err) => {
        if (result) {
          const text = result.getText();
          this.handleScan(text);
        }
      });
    } catch (e) {
      this.scanning.set(false);
      this.resultValid.set(false);
      this.resultReason.set('camera_error');
    }
  }

  stopScanner(): void {
    if (this.controls) {
      this.controls.stop();
      this.controls = null;
    }
    this.scanning.set(false);
  }

  handleScan(text: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(text)) {
      this.resultValid.set(false);
      this.resultReason.set('invalid_format');
      return;
    }
    this.scannedUuid.set(text);
    this.stopScanner();
    this.ticketsService.scanTicketByUuid(text).subscribe({
      next: (res) => {
        this.resultValid.set(!!res?.valid);
        this.resultReason.set(res?.reason || '');
      },
      error: () => {
        this.resultValid.set(false);
        this.resultReason.set('server_error');
      }
    });
  }

  onManualSubmit(): void {
    const value = this.manualUuid().trim();
    if (!value) {return;}
    this.handleScan(value);
  }

  restart(): void {
    this.startScanner();
  }

  getRoleDisplayName(): string {
    return this.authService.getRoleDisplayName();
  }
}