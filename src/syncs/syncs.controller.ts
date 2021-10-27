import { Body, Controller, Post } from '@nestjs/common';
import { SyncsService } from './syncs.service';

@Controller('syncs')
export class SyncsController {
  constructor(private readonly productsService: SyncsService) {}

  private temp =
    '{"channel":"server","email":"test@example.org","event":"Segment Test Event Name","messageId":"segment-test-message-qa7kj","projectId":"oZBeTsHP71VkUEbGzwzX6","properties":{"property1":1,"property2":"test","property3":true},"replay":true,"timestamp":"2021-10-27T05:45:39.571Z","type":"track","userId":"test-user-b2jr3d"}';

  @Post('segment')
  addProduct(@Body() body: any): any {
    console.log(body);

    const params = body;
    return { type: params.type, event: params.event };
  }
}
