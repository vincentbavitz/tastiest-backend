import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersModule } from 'src/users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService, TrackingService, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}
