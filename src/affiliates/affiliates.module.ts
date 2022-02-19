import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersModule } from 'src/users/users.module';
import { AffiliateSubmissionEntity } from './affiliate-submission.entity';
import { AffiliatesController } from './affiliates.controller';
import { AffiliatesService } from './affiliates.service';

@Module({
  imports: [TypeOrmModule.forFeature([AffiliateSubmissionEntity]), UsersModule],
  controllers: [AffiliatesController],
  providers: [AffiliatesService, TrackingService],
})
export class AffiliatesModule {}
