import { Component, signal, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../auth/auth.interface';
import { 
  matDashboard,
  matLogout,
  matPerson,
  matEvent,
  matAnalytics,
  matSettings,
  matNotifications,
  matBarChart
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-dashboard-home',
  imports: [NgIcon, RouterLink, DashboardNavbarComponent],
  templateUrl: './home.component.html',
  providers: [
    provideIcons({ 
      matDashboard,
      matLogout,
      matPerson,
      matEvent,
      matAnalytics,
      matSettings,
      matNotifications,
      matBarChart
    })
  ]
})
export class HomeComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.authService.logout();
      return;
    }
    this.currentUser.set(user);
  }

  getGreeting(): string {
    const user = this.currentUser();
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) {
      timeGreeting = 'Guten Morgen';
    } else if (hour < 18) {
      timeGreeting = 'Guten Tag';
    } else {
      timeGreeting = 'Guten Abend';
    }
    
    return `${timeGreeting}, ${user.firstname}!`;
  }

  getRoleDisplayName(): string {
    const user = this.currentUser();
    switch (user.role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Event Manager';
      case 'user':
        return 'Benutzer';
      default:
        return user.role;
    }
  }
}
