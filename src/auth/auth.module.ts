import { Module } from '@nestjs/common';
import { AccountModule } from 'src/admin/account/account.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, AccountModule],
  controllers: [AuthController],
})
export class AuthModule {}
