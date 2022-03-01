import * as Joi from '@hapi/joi';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core/router/router-module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreAuthMiddleware } from './auth/pre-auth.middleware';
import databaseConfig from './database/database.config';
import { DatabaseModule } from './database/database.module';
import { FirebaseModule } from './firebase/firebase.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: Joi.object({
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_CLIENT_EMAIL: Joi.string().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),
        FIREBASE_DATABASE_URL: Joi.string().required(),
        FIREBASE_API_KEY: Joi.string().required(),
        FIREBASE_AUTH_DOMAIN: Joi.string().required(),
        FIREBASE_STORAGE_BUCKET: Joi.string().required(),
        FIREBASE_MESSAGING_SENDER_ID: Joi.string().required(),
        FIREBASE_APP_ID: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    EventEmitterModule.forRoot(),
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
    ]),
    ScheduleModule.forRoot(),
    FirebaseModule,
    // AdminModule,
    // SyncsModule,
    // SupportModule,
    // UsersModule,
    // RestaurantsModule,
    // PaymentsModule,
    DatabaseModule,
    // BookingsModule,
    // OrdersModule,
    // AuthModule,
    // AffiliatesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // TrackingService,
    // TasksService,
    PrismaService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreAuthMiddleware).exclude('public').forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
