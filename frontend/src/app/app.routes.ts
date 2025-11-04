import { Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
import { RoleGuard } from './services/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dash/home',
    loadComponent: () => import('./features/dashboard/home/role-home.component').then(m => m.RoleHomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/options',
    loadComponent: () => import('./features/dashboard/options/options.component').then(m => m.OptionsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/events',
    loadComponent: () => import('./features/dashboard/events/events-list.component').then(m => m.EventsListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/users',
    loadComponent: () => import('./features/dashboard/users/users-list.component').then(m => m.UsersListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'dash/events/new',
    loadComponent: () => import('./features/dashboard/events/new-event.component').then(m => m.NewEventComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'dash/events/edit/:id',
    loadComponent: () => import('./features/dashboard/events/edit-event.component').then(m => m.EditEventComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'dash/users/edit/:id',
    loadComponent: () => import('./features/dashboard/users/edit-user.component').then(m => m.EditUserComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'dash/tickets',
    loadComponent: () => import('./features/dashboard/tickets/tickets-list.component').then(m => m.TicketsListComponent),
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'dash/tickets/new',
    loadComponent: () => import('./features/dashboard/tickets/new-ticket.component').then(m => m.NewTicketComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager', 'user'] }
  },
  {
    path: 'dash/tickets/edit/:id',
    loadComponent: () => import('./features/dashboard/tickets/edit-ticket.component').then(m => m.EditTicketComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'dash/tickets/qr/:id',
    loadComponent: () => import('./features/dashboard/tickets/ticket-qr.component').then(m => m.TicketQrComponent),
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'dash/tickets/scanner',
    loadComponent: () => import('./features/dashboard/tickets/ticket-scanner.component').then(m => m.TicketScannerComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] }
  }
];
