import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dash/home',
    loadComponent: () => import('./dashboard/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/options',
    loadComponent: () => import('./dashboard/options/options.component').then(m => m.OptionsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/events',
    loadComponent: () => import('./dashboard/events/events-list.component').then(m => m.EventsListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/events/new',
    loadComponent: () => import('./dashboard/events/new-event.component').then(m => m.NewEventComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/events/edit/:id',
    loadComponent: () => import('./dashboard/events/edit-event.component').then(m => m.EditEventComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/tickets',
    loadComponent: () => import('./dashboard/tickets/tickets-list.component').then(m => m.TicketsListComponent),
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'dash/tickets/new',
    loadComponent: () => import('./dashboard/tickets/new-ticket.component').then(m => m.NewTicketComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/tickets/edit/:id',
    loadComponent: () => import('./dashboard/tickets/edit-ticket.component').then(m => m.EditTicketComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dash/tickets/qr/:id',
    loadComponent: () => import('./dashboard/tickets/ticket-qr.component').then(m => m.TicketQrComponent),
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'dash/tickets/scanner',
    loadComponent: () => import('./dashboard/tickets/ticket-scanner.component').then(m => m.TicketScannerComponent),
    canActivate: [AuthGuard]
  }
];
