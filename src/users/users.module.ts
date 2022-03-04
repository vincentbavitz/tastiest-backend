import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountService } from 'src/admin/account/account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UserCreatedListener } from './listeners/user-created.listener';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    PrismaService,
    TrackingService,
    AccountService,
    UserCreatedListener,
  ],
  exports: [UsersService],
})
export class UsersModule {}
