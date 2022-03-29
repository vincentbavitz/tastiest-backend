import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountModule } from 'src/admin/account/account.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UserCreatedListener } from './listeners/user-created.listener';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AccountModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    PrismaService,
    TrackingService,
    UserCreatedListener,
  ],
  exports: [UsersService],
})
export class UsersModule {}
