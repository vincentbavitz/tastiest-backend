import { Body, Controller, Post } from '@nestjs/common';
import { SegmentWebhookBody } from './sync.model';
import { SyncsService } from './syncs.service';

@Controller('syncs')
export class SyncsController {
  constructor(private readonly syncsService: SyncsService) {}

  private temp =
    '{"channel":"server","email":"test@example.org","event":"Segment Test Event Name","messageId":"segment-test-message-qa7kj","projectId":"oZBeTsHP71VkUEbGzwzX6","properties":{"property1":1,"property2":"test","property3":true},"replay":true,"timestamp":"2021-10-27T05:45:39.571Z","type":"track","userId":"test-user-b2jr3d"}';

  @Post('segment')
  syncSegmentEvent(@Body() body: SegmentWebhookBody): any {
    return this.syncsService.syncSegmentEvent(body as SegmentWebhookBody);
  }
}
