import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, UsersService],
})
export class OrdersModule {}
