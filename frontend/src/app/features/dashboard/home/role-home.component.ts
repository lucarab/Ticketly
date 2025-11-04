import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHomeComponent } from './admin-home.component';
import { ManagerHomeComponent } from './manager-home.component';
import { UserHomeComponent } from './user-home.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserResponse } from '../../../models/user.model';

@Component({
  selector: 'app-role-home',
  imports: [CommonModule, AdminHomeComponent, ManagerHomeComponent, UserHomeComponent],
  templateUrl: './role-home.component.html'
})
export class RoleHomeComponent implements OnInit {
  currentUser = signal<UserResponse | null>(null);
  role = signal<string>('');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.authService.logout();
      return;
    }
    this.currentUser.set(user);
    this.role.set(user.role);
  }
}