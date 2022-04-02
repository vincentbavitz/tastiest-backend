import { Body, Controller, Post, Request } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/auth.model';
import { SegmentWebhookBody } from './sync.model';
import { SyncsService } from './syncs.service';

@Controller('public/syncs')
export class SyncsController {
  constructor(private readonly syncsService: SyncsService) {}

  @Post('segment')
  syncSegmentEvent(@Body() body: SegmentWebhookBody): any {
    return this.syncsService.syncSegmentEvent(body as SegmentWebhookBody);
  }

  @Post('contentful/restaurant')
  async syncRestaurantFromContentful(
    @Body() body: any,
    @Request() request: RequestWithUser,
  ) {
    return this.syncsService.syncRestaurantFromContentful(
      body,
      String(request.headers['x-secret-key']),
    );
  }
}
