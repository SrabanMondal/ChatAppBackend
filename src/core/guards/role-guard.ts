import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role, ROLES_KEY } from '../decorators/roles.decorator';
import { User } from 'src/database/sql/entity/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const req: Request & { user: Omit<User, 'createdAt' | 'updatedAt'> } =
      context.switchToHttp().getRequest();
    if (!req.user) {
      return false;
    }
    const userrole: Role = req.user.role as Role;
    return roles.includes(userrole);
  }
}
