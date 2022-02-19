import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from 'src/admin/account/account.service';
import { OrderEntity } from 'src/orders/order.entity';
import { TrackingService } from 'src/tracking/tracking.service';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity])],
  controllers: [OrdersController],
  providers: [OrdersService, UsersService, TrackingService, AccountService],
  exports: [OrdersService],
})
export class OrdersModule {}
