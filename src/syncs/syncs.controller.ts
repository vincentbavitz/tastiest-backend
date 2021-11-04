import { Body, Controller, Post } from '@nestjs/common';
import { SegmentWebhookBody } from './sync.model';
import { SyncsService } from './syncs.service';

@Controller('syncs')
export class SyncsController {
  constructor(private readonly syncsService: SyncsService) {}

  @Post('segment')
  syncSegmentEvent(@Body() body: SegmentWebhookBody): any {
    return this.syncsService.syncSegmentEvent(body as SegmentWebhookBody);
  }
}
