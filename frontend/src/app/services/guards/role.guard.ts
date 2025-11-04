import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles: string[] = (route.data?.['roles'] || []).map((r: string) => r.toLowerCase());
    if (allowedRoles.length === 0) {
      return true;
    }

    const role = (user.role || '').toLowerCase();
    const isAllowed = allowedRoles.includes(role);
    if (!isAllowed) {
      this.toastr.error('Du hast keine Berechtigung für diese Seite.', 'Zugriff verweigert');
      this.router.navigate(['/dash/home']);
      return false;
    }
    return true;
  }
}