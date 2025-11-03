import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matDashboard, matLogout, matPerson } from '@ng-icons/material-icons/baseline';
import { UserResponse } from '../../auth/auth.interface';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './dashboard-navbar.html',
  providers: [
    provideIcons({
      matDashboard,
      matLogout,
      matPerson,
    }),
  ],
})
export class DashboardNavbarComponent {
  @Input() user: Partial<UserResponse> | null = null;
  @Input() role = '';

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  logout(): void {
    this.toastr.success('Du hast dich erfolgreich ausgeloggt.', 'Logout erfolgreich!', {
      timeOut: 5000,
      progressBar: true
    });
    this.authService.logout();
  }
}