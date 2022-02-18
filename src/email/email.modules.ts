import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrackingService } from 'src/tracking/tracking.service';
import EmailService from './email.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [EmailService, TrackingService],
  exports: [EmailService],
})
export class EmailModule {}
