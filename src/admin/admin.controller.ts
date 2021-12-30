import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import RoleGuard from 'src/auth/role.guard';
import { AdminService } from './admin.service';
import GetUserDto from './dto/get-user.dto';
import GetUsersDto from './dto/get-users.dto';
import SetUserRoleDto from './dto/set-user-role.dto';

@Controller('admin')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get users in Firebase.
   * Selecting a role limits selection.
   * By default, only eaters will be returned.
   *
   * @link AdminService
   */
  @Get('users')
  async getUsers(@Query() getUsersDto: GetUsersDto) {
    return this.adminService.getUsers(
      getUsersDto.role,
      getUsersDto.limit,
      getUsersDto.pageToken,
    );
  }

  /** Get a particular user in Firebase. */
  @Get('users/:uid')
  async getUser(@Request() req, @Param() getUserDto: GetUserDto) {
    return this.adminService.getUser(getUserDto.uid);
  }

  /**
   * Set a role (claim) on a user. Eg. `restaurant`, `ester`, `admin`.
   * @param role The role of the user to set.
   * @example `https://api.tastiest.io/admin/users/setUserRole/K6edDIi2qAX6OZGdQ1VemKF9QtI2`
   */
  @Post('users/setUserRole')
  async setUserRole(@Body() setUserRoleDto: SetUserRoleDto) {
    return this.adminService.setUserRole(
      setUserRoleDto.uid,
      setUserRoleDto.role,
    );
  }
}
