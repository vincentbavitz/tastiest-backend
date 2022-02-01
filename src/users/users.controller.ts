import {
  Body,
  Controller,
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
  // @UseGuards(RoleGuard(UserRole.EATER))
  async getUser(
    @Param('uid') uid: string,
    @Request() request: RequestWithUser,
  ) {
    return this.userService.getUser(uid, request.user);
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
    return this.userService.updateUser(updateUserDto, request.user);
  }
}
