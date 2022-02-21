import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersModule } from 'src/users/users.module';
import { AffiliatesController } from './affiliates.controller';
import { AffiliatesService } from './affiliates.service';
import { AffiliateSubmissionEntity } from './entities/affiliate-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AffiliateSubmissionEntity]), UsersModule],
  controllers: [AffiliatesController],
  providers: [AffiliatesService, TrackingService],
})
export class AffiliatesModule {}
