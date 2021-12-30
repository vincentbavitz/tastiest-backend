import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { PreAuthMiddleware } from './firebase/pre-auth-middleware';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { SupportModule } from './support/support.module';
import { SyncsModule } from './syncs/syncs.module';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    SyncsModule,
    SupportModule,
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
