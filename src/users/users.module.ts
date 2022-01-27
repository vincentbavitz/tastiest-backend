import { Module } from '@nestjs/common';
import { AccountService } from 'src/admin/account/account.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AccountService],
})
export class UsersModule {}
