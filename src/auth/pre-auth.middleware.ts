import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthenticatedUser } from './auth.model';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  private auth: firebase.auth.Auth;

  constructor(private firebaseApp: FirebaseService) {
    this.auth = this.firebaseApp.getAuth();
  }

  /**
   * Here we append user information to the request.
   * Role guards are taken care of in /auth/role.guard.ts.
   *
   * We automatically deny access to anyone without a valid Bearer token.
   *
   * FYI this middleware does not make direct requests to Firebase, it
   * validates the token on the server. So don't worry about this slowing requests.
   */
  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;

    // Allow all public routes through.
    // This allows, for example...
    // /auth/public/register
    // /public/content/
    // ...etc
    if (req.url.split('/').includes('public')) {
      req['user'] = null;
      return next();
    }

    if (token != null && token != '') {
      this.auth
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          const user: AuthenticatedUser = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            type: decodedToken.type,
            roles: [],
          };

          // Add roles to user.
          // prettier-ignore
          if (decodedToken[UserRole.RESTAURANT]) user.roles.push(UserRole.RESTAURANT);
          if (decodedToken[UserRole.ADMIN]) user.roles.push(UserRole.ADMIN);
          if (decodedToken[UserRole.EATER]) user.roles.push(UserRole.EATER);

          // Assign user for the next middleware.
          req['user'] = user;
          next();
        })
        .catch((error) => {
          console.log('pre-auth.middleware ➡️ error:', error);

          PreAuthMiddleware.accessDenied(req.url, res);
        });
    } else {
      PreAuthMiddleware.accessDenied(req.url, res);
    }
  }

  private static accessDenied(url: string, res: Response) {
    res.status(403).json({
      timestamp: new Date().toISOString(),
      message: 'Access denied',
      path: url,
    });
  }
}
