import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matDashboard, matLogout, matPerson } from '@ng-icons/material-icons/baseline';
import { UserResponse } from '../../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';

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

  getRoleDisplayName(): string {
    return this.authService.getRoleDisplayName(this.user?.role);
  }

  logout(): void {
    this.toastr.success('Du wurdest erfolgreich abgemeldet.', 'Logout');
    this.authService.logout();
  }
}