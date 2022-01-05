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
import { AccountService } from './account.service';
import GetAccountDto from './dto/get-account.dto';
import GetAccountsDto from './dto/get-accounts.dto';
import SetAccountRoleDto from './dto/set-account-role.dto';

@Controller('accounts')
@UseGuards(RoleGuard(UserRole.ADMIN))
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * Get accounts in Firebase.
   * Selecting a role limits selection.
   * By default, only eaters will be returned.
   *
   * @link AdminService
   */
  @Get()
  async getAccounts(@Query() getAccountsDto: GetAccountsDto) {
    return this.accountService.getAccounts(
      getAccountsDto.role,
      getAccountsDto.limit,
      getAccountsDto.pageToken,
    );
  }

  /** Get a particular user in Firebase. */
  @Get(':uid')
  async getAccount(@Request() req, @Param() getAccountDto: GetAccountDto) {
    return this.accountService.getAccount(getAccountDto.uid);
  }

  /**
   * Set a role (claim) on a user. Eg. `restaurant`, `ester`, `admin`.
   * @param role The role of the user to set.
   * @example `https://api.tastiest.io/admin/users/setUserRole/K6edDIi2qAX6OZGdQ1VemKF9QtI2`
   */
  @Post('setRole')
  async setUserRole(@Body() setAccountRoleDto: SetAccountRoleDto) {
    return this.accountService.setAccountRole(
      setAccountRoleDto.uid,
      setAccountRoleDto.role,
    );
  }
}
