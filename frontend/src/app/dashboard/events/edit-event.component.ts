import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matEvent, matSave, matSync, matArrowBack } from '@ng-icons/material-icons/baseline';
import { ToastrService } from 'ngx-toastr';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../auth/auth.interface';
import { EventsService } from '../../events/events.service';

@Component({
  selector: 'app-edit-event',
  imports: [ReactiveFormsModule, NgIf, RouterLink, NgIcon, DashboardNavbarComponent],
  templateUrl: './edit-event.component.html',
  providers: [
    provideIcons({ matEvent, matSave, matSync, matArrowBack })
  ]
})
export class EditEventComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  form!: FormGroup;
  saving = false;
  loading = true;
  eventId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
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

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      datetime: ['', [Validators.required]],
      price: ['', [Validators.required]],
      maxTicketAmount: [1, [Validators.required, Validators.min(1)]],
      description: [''],
      status: ['draft', [Validators.required]]
    });

    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.eventId) {
      this.toastr.error('Ungültige Event-ID.', 'Fehler');
      this.router.navigate(['/dash/events']);
      return;
    }

    this.eventsService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.form.patchValue({
          name: event?.name ?? '',
          location: event?.location ?? '',
          datetime: event?.datetime ? new Date(event.datetime).toISOString().slice(0,16) : '',
          price: event?.price ?? '',
          maxTicketAmount: event?.maxTicketAmount ?? 1,
          description: event?.description ?? '',
          status: event?.status ?? 'draft'
        });
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.message || 'Event konnte nicht geladen werden.', 'Fehler');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const value = this.form.value;
    const payload = {
      name: value.name,
      location: value.location,
      datetime: value.datetime ? new Date(value.datetime).toISOString() : undefined,
      price: value.price,
      maxTicketAmount: value.maxTicketAmount,
      description: value.description,
      status: value.status
    };
    this.eventsService.updateEvent(this.eventId, payload).subscribe({
      next: () => {
        this.toastr.success('Event wurde aktualisiert.', 'Erfolg');
        this.router.navigate(['/dash/events']);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Event konnte nicht aktualisiert werden.', 'Fehler');
        this.saving = false;
      }
    });
  }

  hasFieldError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control) return '';
    if (control.hasError('required')) return 'Dieses Feld ist erforderlich.';
    if (control.hasError('minlength')) return 'Eingabe ist zu kurz.';
    if (control.hasError('min')) return 'Der Wert ist zu niedrig.';
    return 'Ungültige Eingabe.';
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