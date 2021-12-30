import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { dlog, UserRole } from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser, RequestWithUser } from './auth.model';

const RoleGuard = (role: UserRole): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      dlog('role.guard ➡️ user:', user);

      // Admins can access all routes.
      return this.isAdmin(user) || user?.roles.includes(role);
    }

    isAdmin(user: AuthenticatedUser) {
      return Boolean(user?.roles.includes(UserRole.ADMIN));
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
