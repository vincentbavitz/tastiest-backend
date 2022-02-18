import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Module({
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
