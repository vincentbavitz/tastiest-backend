import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from 'src/admin/account/account.service';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { TrackingService } from 'src/tracking/tracking.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([OrderEntity, UserEntity])],
  controllers: [OrdersController],
  providers: [OrdersService, TrackingService, AccountService],
  exports: [OrdersService],
})
export class OrdersModule {}
