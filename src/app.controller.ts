import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  async ping(): Promise<string> {
    return 'pong';
  }

  @Get('/secure/ping')
  async securePing(): Promise<string> {
    return 'pong';
  }
}
