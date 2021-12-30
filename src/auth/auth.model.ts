import { UserRole } from '@tastiest-io/tastiest-utils';
import { Request } from 'express';

export interface AuthenticatedUser {
  email: string;
  roles: UserRole[];
  type: any;
}

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
