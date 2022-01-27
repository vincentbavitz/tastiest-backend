import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { RequestWithUser } from 'src/auth/auth.model';
import RoleGuard from 'src/auth/role.guard';
import CreateUserDto from './dto/create-user.dto';
import GetUserProfilesDto from './dto/get-user-profiles.dto';
import { UsersService } from './users.service';

/**
 * NOTE. Users in this context refers only to eaters.
 * That means users who are using Tastiest as customers only.
 * If you are looking for restaurant accounts, look into AccountService.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Request() request: RequestWithUser,
  ) {
    this.userService.createUser(createUserDto, request.user);
  }

  /**
   * Strictly gets eaters profiles.
   * Does not get profiles of restaurant users or admins.
   */
  @Get()
  @UseGuards(RoleGuard(UserRole.ADMIN))
  async getUserProfiles(@Query() getUserProfilesDto: GetUserProfilesDto) {
    return this.userService.getUserProfiles(
      getUserProfilesDto.limit,
      getUserProfilesDto.skip,
    );
  }
}
