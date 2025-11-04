import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../auth/auth.interface';
import { matSettings } from '@ng-icons/material-icons/baseline';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-options',
  standalone: true,
  imports: [NgIcon, DashboardNavbarComponent, ReactiveFormsModule, NgIf, DatePipe, RouterLink],
  templateUrl: './options.component.html',
  providers: [
    provideIcons({
      matSettings
    })
  ]
})
export class OptionsComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  passwordForm!: FormGroup;
  deleteForm!: FormGroup;
  isSavingPassword = signal(false);
  isDeleting = signal(false);

  constructor(private authService: AuthService, private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.authService.logout();
      return;
    }
    this.currentUser.set(user);

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    this.deleteForm = this.fb.group({
      confirm: ['', [Validators.required, Validators.pattern(/^LÖSCHEN$/i)]]
    });
  }

  getRoleDisplayName(): string {
    const user = this.currentUser();
    const role = user?.role?.toLowerCase();
    switch (role) {
      case 'admin': return 'Administrator';
      case 'user': return 'Benutzer';
      case 'organizer': return 'Veranstalter';
      default: return 'Unbekannte Rolle';
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.toastr.error('Bitte fülle alle Felder korrekt aus.', 'Ungültige Eingaben');
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.toastr.error('Die neuen Passwörter stimmen nicht überein.', 'Ungültige Eingaben');
      return;
    }

    this.isSavingPassword.set(true);
    this.authService.updatePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.toastr.success('Passwort wurde erfolgreich geändert.', 'Passwort geändert');
        this.passwordForm.reset();
        this.isSavingPassword.set(false);
        this.authService.logout();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Passwortänderung fehlgeschlagen.', 'Fehler');
        this.isSavingPassword.set(false);
      }
    });
  }

  onDeleteAccount(): void {
    if (this.deleteForm.invalid) {
      this.toastr.error('Gib zur Bestätigung „LÖSCHEN” ein.', 'Bestätigung erforderlich');
      return;
    }

    this.isDeleting.set(true);
    this.authService.deleteAccount().subscribe({
      next: () => {
        this.toastr.success('Dein Account wurde gelöscht.', 'Account gelöscht');
        this.isDeleting.set(false);
        this.authService.logout();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Accountlöschung fehlgeschlagen.', 'Fehler');
        this.isDeleting.set(false);
      }
    });
  }

  hasPasswordFieldError(fieldName: string): boolean {
    const field = this.passwordForm?.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  getPasswordFieldError(fieldName: string): string {
    const field = this.passwordForm?.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        switch (fieldName) {
          case 'currentPassword': return 'Aktuelles Passwort ist erforderlich';
          case 'newPassword': return 'Neues Passwort ist erforderlich';
          case 'confirmPassword': return 'Neues Passworts ist erforderlich';
        }
      }
      if (field.errors['minlength']) {
        return 'Passwort muss mindestens 6 Zeichen lang sein';
      }
      if (fieldName === 'confirmPassword') {
        const newPassword = this.passwordForm?.get('newPassword')?.value;
        const confirmPassword = field.value;
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
          return 'Die neuen Passwörter stimmen nicht überein';
        }
      }
    }
    return '';
  }

  hasDeleteFieldError(fieldName: string): boolean {
    const field = this.deleteForm?.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  getDeleteFieldError(fieldName: string): string {
    const field = this.deleteForm?.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Bestätigung ist erforderlich';
      }
      if (field.errors['pattern']) {
        return 'Bitte gib „LÖSCHEN” zur Bestätigung ein';
      }
    }
    return '';
  }
}