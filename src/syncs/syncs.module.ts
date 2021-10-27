import { Module } from '@nestjs/common';
import { SyncsController } from './syncs.controller';
import { SyncsService } from './syncs.service';

@Module({
  controllers: [SyncsController],
  providers: [SyncsService],
})
export class SyncsModule {}
