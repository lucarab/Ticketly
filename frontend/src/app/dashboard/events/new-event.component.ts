import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matEvent, matSave, matSync, matArrowBack } from '@ng-icons/material-icons/baseline';
import { ToastrService } from 'ngx-toastr';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../auth/auth.interface';
import { EventsService } from '../../events/events.service';

@Component({
  selector: 'app-new-event',
  imports: [ReactiveFormsModule, NgIf, RouterLink, NgIcon, DashboardNavbarComponent],
  templateUrl: './new-event.component.html',
  providers: [
    provideIcons({ matEvent, matSave, matSync, matArrowBack })
  ]
})
export class NewEventComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  form!: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService,
    private eventsService: EventsService
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
      price: ['0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      maxTicketAmount: [1, [Validators.required, Validators.min(1)]],
      description: [''],
      status: ['draft', [Validators.required]]
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
      datetime: new Date(value.datetime).toISOString(),
      price: value.price,
      maxTicketAmount: value.maxTicketAmount,
      description: value.description,
      status: value.status
    };
    this.eventsService.createEvent(payload).subscribe({
      next: () => {
        this.toastr.success('Event wurde erfolgreich erstellt.', 'Erfolg');
        this.router.navigate(['/dash/home']);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Event konnte nicht erstellt werden.', 'Fehler');
        this.saving = false;
      }
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.form?.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.form?.get(fieldName);
    if (field?.errors && field.touched) {
      if (fieldName === 'name') {
        if (field.errors['required']) return 'Name ist erforderlich';
        if (field.errors['minlength']) return 'Name muss mindestens 3 Zeichen lang sein';
      }
      if (fieldName === 'location') {
        if (field.errors['required']) return 'Ort ist erforderlich';
        if (field.errors['minlength']) return 'Ort muss mindestens 2 Zeichen lang sein';
      }
      if (fieldName === 'datetime') {
        if (field.errors['required']) return 'Datum & Zeit sind erforderlich';
      }
      if (fieldName === 'price') {
        if (field.errors['required']) return 'Preis ist erforderlich';
        if (field.errors['pattern']) return 'Preis muss im Format 0.00 angegeben werden';
      }
      if (fieldName === 'maxTicketAmount') {
        if (field.errors['required']) return 'Max. Tickets sind erforderlich';
        if (field.errors['min']) return 'Es muss mindestens 1 Ticket erlaubt sein';
      }
      if (fieldName === 'status') {
        if (field.errors['required']) return 'Status ist erforderlich';
      }
    }
    return '';
  }

  getRoleDisplayName(): string {
    const user = this.authService.getCurrentUser();
    const role = user?.role?.toLowerCase();
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Event Manager';
      case 'organizer':
        return 'Veranstalter';
      case 'user':
        return 'Benutzer';
      default:
        return role || '';
    }
  }
}