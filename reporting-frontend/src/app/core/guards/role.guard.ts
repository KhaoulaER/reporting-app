import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { RoleService } from '../services/role.service';


@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    if (this.roleService.isInRoles(requiredRoles)) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}