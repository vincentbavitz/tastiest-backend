import { Module } from '@nestjs/common';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { AccountService } from './account/account.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ServerController } from './server/server.controller';
import { ServerModule } from './server/server.module';
import { ServerService } from './server/server.service';

@Module({
  controllers: [AdminController, AccountController, ServerController],
  providers: [AdminService, AccountService, ServerService],
  imports: [AccountModule, ServerModule],
})
export class AdminModule {}
