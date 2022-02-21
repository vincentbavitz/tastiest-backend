import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from 'src/admin/account/account.service';
import { FollowerEntity } from 'src/entities/follower.entity';
import { TrackingService } from 'src/tracking/tracking.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserCreatedListener } from './listeners/user-created.listener';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowerEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    TrackingService,
    AccountService,
    UserCreatedListener,
  ],
  exports: [UsersService],
})
export class UsersModule {}
