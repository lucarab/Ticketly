import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matDashboard, matLogout, matPerson } from '@ng-icons/material-icons/baseline';
import { UserResponse } from '../../auth/auth.interface';

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
  @Output() logout = new EventEmitter<void>();
}