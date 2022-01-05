import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import RoleGuard from 'src/auth/role.guard';
import { UsersService } from 'src/users/users.service';

@Controller('payments')
@UseGuards(RoleGuard(UserRole.EATER))
export class PaymentsController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Pay an order
   */
  @Post()
  async pay(@Body() payDto: PayDto) {
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
