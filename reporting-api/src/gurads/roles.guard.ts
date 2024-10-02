import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditService } from 'src/audit/_business/audit.service';
import { GROUPS_KEY, ROLES_KEY } from 'src/decos/roles.decorator';
import { AuthenticationService } from 'src/iam/_business/authentification.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private auditService:AuditService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [];

    const requiredGroups = this.reflector.getAllAndOverride<string[]>(GROUPS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [];

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    const userRoles = user.roles || [];
    const userGroups = user.groups || [];

    // Check if the user has the required group (PROJECT_MANAGER or AUDITOR)
    if (requiredGroups.length > 0) {
      const hasGroup = requiredGroups.some(group => userGroups.includes(group));
      if (!hasGroup) {
        throw new ForbiddenException('Access denied: Insufficient group');
      }
    }

    // Get the project ID from the request (based on auditId)
    /*const firstItem = Array.isArray(request.body) ? request.body[0] : request.body;
    const auditId = firstItem?.audit?.id;
    //console.log(`REQUEST BODY: ${JSON.stringify(request.body, null, 2)}`);
    const projectId = await this.getProjectIdFromAudit(auditId);  // Fetch project ID from audit
    console.log('Audit ID:', auditId);



    console.log('Fetched Project ID:', projectId);
    if (!projectId) {
      throw new ForbiddenException('Project ID not found for this audit');
    }

    // Form the dynamic role: project-${projectId}-read-write
    const requiredRole = `project-${projectId}-read-write`;
    console.log('project role: ',requiredRole)
    console.log('User roles: ',userRoles)
   

    // Check if the user has the required dynamic role
    if (requiredRoles.length > 0) {
      const hasRole = userRoles.includes(requiredRole);
      if (!hasRole) {
        throw new ForbiddenException('Access denied: Insufficient role for this project');
      }
    }
*/
      
    return true;
  }
  // Helper function to get project ID from audit
  private async getProjectIdFromAudit(auditId: string): Promise<string> {
    const audit = await this.auditService.findAuditById(auditId); // Fetch audit by ID
    return audit?.norme_projet?.projet?.id;  // Assuming norme_projet has the project ID
  }
}
