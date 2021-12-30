import { Controller, Get, Param, Post } from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get users in Firebase.
   * Selecting roles limits selection.
   * By default, only eaters will be returned.
   */
  @Get('users')
  async getUsers(@Param() roles?: UserRole[]) {
    return this.adminService.getUsers();
  }

  /** Get a particular user in Firebase. */
  @Get('users/:uid')
  async getUser(@Param() uid: string) {
    return this.adminService.getUser(uid);
  }

  /**
   * Set a role (claim) on a user. Eg. `restaurant` or `admin`.
   * @param role The role of the user to set.
   */
  @Post('users/setUserRole/:uid')
  async setUserRole() {
    return null;
  }
}
