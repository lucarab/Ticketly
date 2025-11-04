import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterRequest } from '../../models/auth.model';
import { Navbar } from '../shared/navbar/navbar.component';
import { 
  matEmail, 
  matLock, 
  matPerson, 
  matSync,
  matVisibility,
  matVisibilityOff
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIcon, RouterLink, Navbar],
  templateUrl: './register.component.html',
  providers: [
    provideIcons({ 
      matEmail, 
      matLock, 
      matVisibility, 
      matVisibilityOff,
      matPerson,
      matSync
    })
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.toastr.error('Bitte fülle alle Felder korrekt aus.', 'Ungültige Eingaben');
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.toastr.error('Die Passwörter stimmen nicht überein.', 'Ungültige Eingaben');
      return;
    }

    this.isLoading.set(true);

    const payload: RegisterRequest = {
      firstname: this.registerForm.value.firstname,
      lastname: this.registerForm.value.lastname,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.toastr.success(`Konto erstellt. Willkommen, ${response.user.firstname}!`, 'Registrierung erfolgreich');
        this.router.navigate(['/dash/home']);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.toastr.error(error.message || 'Registrierung fehlgeschlagen. Bitte versuche es erneut.', 'Fehler');
        this.isLoading.set(false);
      }
    });
  }
}