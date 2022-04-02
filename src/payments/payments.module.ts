import { Module } from '@nestjs/common';
import { BookingsModule } from 'src/bookings/bookings.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingModule } from 'src/tracking/tracking.module';
import { UsersModule } from 'src/users/users.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [UsersModule, OrdersModule, BookingsModule, TrackingModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService],
})
export class PaymentsModule {}
