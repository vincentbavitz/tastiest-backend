import { Body, Controller, Post } from '@nestjs/common';
import { SyncsService } from './syncs.service';

@Controller('syncs')
export class SyncsController {
  constructor(private readonly productsService: SyncsService) {}

  @Post('segment')
  addProduct(@Body() body: any): any {
    console.log(body);

    return { body };
  }
}
