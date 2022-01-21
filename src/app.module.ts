import * as Joi from '@hapi/joi';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core/router/router-module';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreAuthMiddleware } from './auth/pre-auth.middleware';
import { BookingsModule } from './bookings/bookings.module';
import { DatabaseModule } from './database/database.module';
import { FirebaseModule } from './firebase/firebase.module';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsService } from './payments/payments.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { SupportModule } from './support/support.module';
import { SyncsModule } from './syncs/syncs.module';
import { TasksService } from './tasks/tasks.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
    ]),
    ScheduleModule.forRoot(),
    DatabaseModule,
    FirebaseModule,
    AdminModule,
    SyncsModule,
    SupportModule,
    UsersModule,
    RestaurantsModule,
    PaymentsModule,
    DatabaseModule,
    BookingsModule,
  ],
  controllers: [AppController, PaymentsController],
  providers: [AppService, TasksService, PaymentsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreAuthMiddleware).forRoutes({
      path: '/*',
      method: RequestMethod.ALL,
    });
  }
}
