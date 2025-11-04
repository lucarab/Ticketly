import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matPerson, matEdit, matDelete, matArrowBack } from '@ng-icons/material-icons/baseline';
import { DashboardNavbarComponent } from '../../shared/dashboard-navbar/dashboard-navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserResponse } from '../../../models/user.model';
import { UsersService } from '../../../services/users/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-list',
  imports: [RouterLink, NgIcon, DashboardNavbarComponent, DatePipe],
  templateUrl: './users-list.component.html',
  providers: [
    provideIcons({ matPerson, matEdit, matDelete, matArrowBack })
  ]
})
export class UsersListComponent implements OnInit {
  currentUser = signal<UserResponse>({} as UserResponse);
  users = signal<UserResponse[]>([]);
  loading = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.authService.logout();
      return;
    }
    this.currentUser.set(user);
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading.set(true);
    this.usersService.getUsers().subscribe({
      next: (list) => {
        this.users.set(list || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastr.error(err?.message || 'Fehler beim Laden der Benutzer. Bitte versuche es erneut.', 'Laden fehlgeschlagen');
        this.loading.set(false);
      }
    });
  }

  onDelete(user: UserResponse): void {
    const fullName = `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim() || 'Benutzer';
    const confirmed = confirm(`Möchtest du "${fullName}" wirklich löschen?`);
    if (!confirmed) return;
    this.usersService.deleteUser(user.id as number).subscribe({
      next: () => {
        this.toastr.success(`"${fullName}" wurde gelöscht.`, 'Benutzer gelöscht');
        this.fetchUsers();
      },
      error: (err) => {
        this.toastr.error(err?.message || 'Benutzer konnte nicht gelöscht werden.', 'Fehler');
      }
    });
  }

  isAdmin(): boolean {
    const role = (this.currentUser()?.role || '').toLowerCase();
    return role === 'admin';
  }

  getRoleDisplayName(): string {
    return this.authService.getRoleDisplayName();
  }
}