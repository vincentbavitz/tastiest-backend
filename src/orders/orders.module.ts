import { Module } from '@nestjs/common';
import { AccountService } from 'src/admin/account/account.service';
import { UsersService } from 'src/users/users.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, UsersService, AccountService],
})
export class OrdersModule {}
