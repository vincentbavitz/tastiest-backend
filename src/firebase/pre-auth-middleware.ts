import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { FirebaseService } from './firebase.service';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  private auth: firebase.auth.Auth;

  constructor(private firebaseApp: FirebaseService) {
    this.auth = firebaseApp.getAuth();
  }

  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;

    if (token != null && token != '') {
      this.auth
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          req['user'] = {
            email: decodedToken.email,
            roles: decodedToken.roles || [],
            type: decodedToken.type,
          };

          console.log('pre-auth-middleware ➡️ decodedToken:', decodedToken);

          next();
        })
        .catch(() => {
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
