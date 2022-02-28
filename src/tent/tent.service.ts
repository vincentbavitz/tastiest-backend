import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TentService {
  constructor(private prisma: PrismaService) {}

  getTents() {
    return this.prisma.tent.findMany();
  }
}
