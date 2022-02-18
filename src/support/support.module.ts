import { Module } from '@nestjs/common';
import { TrackingService } from 'src/tracking/tracking.service';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  controllers: [SupportController],
  providers: [SupportService, TrackingService],
})
export class SupportModule {}
