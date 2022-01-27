import { Module } from '@nestjs/common';
import { AccountService } from 'src/admin/account/account.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AccountService],
})
export class AuthModule {}
