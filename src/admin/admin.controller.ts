import { Controller, UseGuards } from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import RoleGuard from 'src/auth/role.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
