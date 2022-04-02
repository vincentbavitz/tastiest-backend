import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import * as osu from 'node-os-utils';
import RoleGuard from 'src/auth/role.guard';

@Controller('server')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class ServerController {
  @Get('system-stats')
  async getCPU() {
    const cpu = await osu.cpu.usage(100);
    const memory = await osu.mem.info();
    const netstat = await osu.netstat.stats();

    const os = {
      ip: await osu.os.ip(),
      name: await osu.os.oos(),
      hostname: await osu.os.hostname(),
      uptime: await osu.os.uptime(),
    };

    return { cpu, os, memory, netstat };
  }
}
