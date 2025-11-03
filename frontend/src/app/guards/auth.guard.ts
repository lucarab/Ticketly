import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.toastr.error(
        'Du musst dich anmelden, um auf diese Seite zugreifen zu können.',
        'Zugriff verweigert',
        {
          timeOut: 5000,
          progressBar: true
        }
      );
      
      this.router.navigate(['/login']);
      return false;
    }
  }
}