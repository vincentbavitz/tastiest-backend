import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { AffiliatesController } from './affiliates.controller';
import { AffiliatesService } from './affiliates.service';

@Module({
  controllers: [AffiliatesController],
  providers: [AffiliatesService, TrackingService, PrismaService],
})
export class AffiliatesModule {}
