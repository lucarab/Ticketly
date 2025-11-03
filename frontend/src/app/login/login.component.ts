import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { LoginRequest } from '../auth/auth.interface';
import { Navbar } from '../shared/navbar/navbar';
import { 
  matEmail, 
  matLock, 
  matVisibility, 
  matVisibilityOff,
  matLogin,
  matSync
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, NgIcon, RouterLink, Navbar],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    provideIcons({ 
      matEmail, 
      matLock, 
      matVisibility, 
      matVisibilityOff,
      matLogin,
      matSync
    })
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      
      const loginData: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.toastr.success(
            `Willkommen zurück, ${response.user.firstname}!`, 
            `Anmeldung als ${response.user.role} erfolgreich`, 
            {
              timeOut: 5000,
              progressBar: true
            }
          );
          this.router.navigate(['/dash/home']);
          
          this.isLoading.set(false);
        },
        error: (error) => {
          this.toastr.error(
            error.message,
            'Anmeldung fehlgeschlagen',
            {
              timeOut: 5000,
              progressBar: true
            }
          );
          this.isLoading.set(false);
        }
      });
    } else {
      this.toastr.error(
        'Bitte fülle alle Felder korrekt aus.',
        'Ungültige Eingaben',
        {
          timeOut: 5000,
          progressBar: true
        }
      );
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName === 'email' ? 'E-Mail-Adresse' : 'Passwort'} ist erforderlich`;
      }
      if (field.errors['email']) {
        return 'Bitte gebe eine gültige E-Mail-Adresse ein';
      }
      if (field.errors['minlength']) {
        return 'Passwort muss mindestens 6 Zeichen lang sein';
      }
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}