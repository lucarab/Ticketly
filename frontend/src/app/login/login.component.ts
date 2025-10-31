import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ToastrService } from 'ngx-toastr';
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
  imports: [ReactiveFormsModule, NgIf, NgIcon, RouterLink],
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
    private toastr: ToastrService
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
      
      // Simulate API call
      setTimeout(() => {
        const { email, password } = this.loginForm.value;
        
        // Demo credentials validation
        const validCredentials = [
          { email: 'admin@ticketly.com', password: 'admin123', role: 'Admin' },
          { email: 'manager@ticketly.com', password: 'manager123', role: 'Manager' },
          { email: 'user@ticketly.com', password: 'user123', role: 'User' }
        ];
        
        const user = validCredentials.find(cred => 
          cred.email === email && cred.password === password
        );
        
        if (user) {
          // Successful login
          this.toastr.success(`Willkommen zurück!`, `Anmeldung als ${user.role} erfolgreich`, {
            timeOut: 5000,
            progressBar: true
          });
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        } else {
          // Failed login
          this.toastr.error(
            'Bitte überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.',
            'Anmeldung fehlgeschlagen',
            {
              timeOut: 5000,
              progressBar: true
            }
          );
        }
        
        this.isLoading.set(false);
      }, 1500);
    } else {
      // Form validation errors
      this.toastr.error(
        'Bitte füllen Sie alle Felder korrekt aus.',
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
        return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
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