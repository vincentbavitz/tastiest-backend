import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { RequestWithUser } from 'src/auth/auth.model';
import RoleGuard from 'src/auth/role.guard';
import UpdateUserDto from './dto/update-user.dto';
import { UsersService } from './users.service';

/**
 * NOTE. Users in this context refers only to eaters.
 * That means users who are using Tastiest as customers only.
 * If you are looking for restaurant accounts, look into AccountService.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * Get a single user.
   */
  @Get(':uid')
  @UseGuards(RoleGuard(UserRole.EATER))
  async getUser(
    @Param('uid') uid: string,
    @Request() request: RequestWithUser,
  ) {
    if (!this.isAdmin(request) && uid !== request.user.uid) {
      throw new ForbiddenException();
    }

    const user = await this.userService.getUser(uid);

    return {
      ...user,

      // The following properties are only visible to Admins.
      financial: this.isAdmin(request) ? user.financial : undefined,
    };
  }

  /**
   * Strictly gets eaters profiles.
   * Does not get profiles of restaurant users or admins.
   */
  @Get()
  @UseGuards(RoleGuard(UserRole.ADMIN))
  async getUsers() {
    return this.userService.getUsers();
  }

  @Post('update')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Request() request: RequestWithUser,
  ) {
    if (!this.isAdmin(request) && updateUserDto.uid !== request.user.uid) {
      throw new ForbiddenException();
    }

    // Only admins can modify financial data.
    if (!this.isAdmin(request) && updateUserDto.financial) {
      throw new ForbiddenException('Unauthorized');
    }

    const updated = await this.userService.updateUser(updateUserDto);

    return {
      ...updated,

      // Only Admins may view these properties
      id: this.isAdmin(request) ? updated.id : undefined,
      financial: this.isAdmin(request) ? updated.financial : undefined,
    };
  }

  private isAdmin(request: RequestWithUser): boolean {
    return request.user.roles.includes(UserRole.ADMIN);
  }
}
