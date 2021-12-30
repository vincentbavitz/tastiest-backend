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
import GetAccountDto from './dto/get-account.dto';
import GetAccountsDto from './dto/get-accounts.dto';
import GetUserProfilesDto from './dto/get-user-profiles.dto';
import SetAccountRoleDto from './dto/set-account-role.dto';

@Controller('admin')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get accounts in Firebase.
   * Selecting a role limits selection.
   * By default, only eaters will be returned.
   *
   * @link AdminService
   */
  @Get('accounts')
  async getAccounts(@Query() getAccountsDto: GetAccountsDto) {
    return this.adminService.getAccounts(
      getAccountsDto.role,
      getAccountsDto.limit,
      getAccountsDto.pageToken,
    );
  }

  /** Get a particular user in Firebase. */
  @Get('accounts/:uid')
  async getAccount(@Request() req, @Param() getAccountDto: GetAccountDto) {
    return this.adminService.getAccount(getAccountDto.uid);
  }

  /**
   * Set a role (claim) on a user. Eg. `restaurant`, `ester`, `admin`.
   * @param role The role of the user to set.
   * @example `https://api.tastiest.io/admin/users/setUserRole/K6edDIi2qAX6OZGdQ1VemKF9QtI2`
   */
  @Post('accounts/setRole')
  async setUserRole(@Body() setAccountRoleDto: SetAccountRoleDto) {
    return this.adminService.setAccountRole(
      setAccountRoleDto.uid,
      setAccountRoleDto.role,
    );
  }

  /**
   * Strictly gets eaters profiles.
   * Does not get profiles of restaurant users or admins.
   */
  @Get('users')
  async getUserProfiles(@Query() getUserProfilesDto: GetUserProfilesDto) {
    return this.adminService.getUserProfiles(
      getUserProfilesDto.limit,
      getUserProfilesDto.skip,
    );
  }
}
