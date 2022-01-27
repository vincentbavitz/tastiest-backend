import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from 'src/admin/account/account.service';
import { UserEntity } from 'src/entities/user.entity';
import { UserCreatedListener } from './listeners/user-created.listener';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, AccountService, UserCreatedListener],
  exports: [UsersService],
})
export class UsersModule {}
