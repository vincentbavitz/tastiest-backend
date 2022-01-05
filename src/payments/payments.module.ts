import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, UsersService],
})
export class PaymentsModule {}
