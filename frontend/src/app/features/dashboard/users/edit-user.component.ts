import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matArrowBack, matEdit, matPerson, matSave, matSync } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserResponse } from '../../../models/user.model';
import { UsersService } from '../../../services/users/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, DashboardNavbarComponent],
  templateUrl: './edit-user.component.html',
  providers: [
    provideIcons({ matPerson, matEdit, matArrowBack, matSave, matSync })
  ]
})
export class EditUserComponent implements OnInit {
  readonly currentUser = signal<UserResponse>({} as UserResponse);
  form!: FormGroup;
  saving = false;
  loading = true;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService,
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
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', [Validators.required]]
    });

    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.userId) {
      this.toastr.error('Ungültige Benutzer-ID.', 'Fehler');
      this.router.navigate(['/dash/users']);
      return;
    }

    this.usersService.getUserById(this.userId).subscribe({
      next: (u) => {
        this.form.patchValue({
          firstname: u?.firstname ?? '',
          lastname: u?.lastname ?? '',
          email: u?.email ?? '',
          role: (u?.role || 'user')
        });
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err?.message || 'Benutzer konnte nicht geladen werden.', 'Fehler');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.saving = true;
    this.usersService.updateUser(this.userId, payload).subscribe({
      next: () => {
        const fullName = `${payload.firstname ?? ''} ${payload.lastname ?? ''}`.trim() || 'Benutzer';
        this.toastr.success(`"${fullName}" wurde aktualisiert.`, 'Benutzer aktualisiert');
        this.router.navigate(['/dash/users']);
      },
      error: (err) => {
        this.toastr.error(err?.message || 'Benutzer konnte nicht aktualisiert werden.', 'Fehler');
        this.saving = false;
      }
    });
  }

  hasFieldError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  getFieldError(field: string): string {
    switch (field) {
      case 'firstname':
      case 'lastname':
        return 'Mindestens 2 Zeichen erforderlich.';
      case 'email':
        return 'Bitte eine gültige E-Mail eingeben.';
      default:
        return 'Pflichtfeld.';
    }
  }

  getRoleDisplayName(): string {
    return this.authService.getRoleDisplayName();
  }
}