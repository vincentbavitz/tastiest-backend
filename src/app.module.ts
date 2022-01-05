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
import { FirebaseModule } from './firebase/firebase.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { SupportModule } from './support/support.module';
import { SyncsModule } from './syncs/syncs.module';
import { TasksService } from './tasks/tasks.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
    ]),
    FirebaseModule,
    AdminModule,
    SyncsModule,
    SupportModule,
    UsersModule,
    RestaurantsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreAuthMiddleware).forRoutes({
      path: '/*',
      method: RequestMethod.ALL,
    });
  }
}
