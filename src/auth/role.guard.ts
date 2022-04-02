import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser, RequestWithUser } from './auth.model';

const RoleGuard = (...roles: UserRole[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      const isValidRole = roles.some((role) => user?.roles.includes(role));

      // Admins can access all routes.
      return this.isAdmin(user) || isValidRole;
    }

    isAdmin(user: AuthenticatedUser) {
      return Boolean(user?.roles.includes(UserRole.ADMIN));
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
