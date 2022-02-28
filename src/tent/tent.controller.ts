import { Controller, Get } from '@nestjs/common';
import { TentService } from './tent.service';

@Controller('tent')
export class TentController {
  constructor(private tentService: TentService) {}

  @Get()
  getTents() {
    return this.tentService.getTents();
  }
}
