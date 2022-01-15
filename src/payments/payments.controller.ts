import { Controller, UseGuards } from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import RoleGuard from 'src/auth/role.guard';

@Controller('payments')
@UseGuards(RoleGuard(UserRole.EATER))
export class PaymentsController {
  constructor() {
    null;
  }
  // constructor(private readonly usersService: UsersService) {}

  // /**
  //  * Pay an order
  //  */
  // @Post()
  // async pay(@Body() payDto: PayDto) {
  //   return this.usersService.getUserProfiles()
  // }
}
