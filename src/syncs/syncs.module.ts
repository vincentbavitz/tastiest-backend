import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SyncsController } from './syncs.controller';
import { SyncsService } from './syncs.service';

@Module({
  controllers: [SyncsController],
  providers: [SyncsService, PrismaService],
})
export class SyncsModule {}
