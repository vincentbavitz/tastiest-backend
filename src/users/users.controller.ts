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
import { User } from '@prisma/client';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { RequestWithUser } from 'src/auth/auth.model';
import RoleGuard from 'src/auth/role.guard';
import FollowRestaurantDto from './dto/follow-restaurant.dto';
import UnfollowRestaurantDto from './dto/unfollow-restaurant.dto';
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
   * Strictly gets eaters profiles.
   * Does not get profiles of restaurant users or ad6mins.
   */
  @Get('')
  @UseGuards(RoleGuard(UserRole.ADMIN))
  async getUsers() {
    return this.userService.getUsers();
  }

  /**
   * Get the user of the token making the request.
   * NOTE! This must come before @Get(':uid')
   * otherwise the dyanmic route will catch it.
   */
  @Get('me')
  async getUserFromToken(@Request() request: RequestWithUser) {
    const user = await this.userService.getUser(request.user.uid);
    return this.sanitizeUserDataIfNeeded(user, request);
  }

  /**
   * Update a user record.
   * NOTE! This must come sequentially before @Get(':uid') in
   * the class otherwise the dyanmic route will catch it.
   */
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

    const updated = await this.userService.updateUser(
      updateUserDto.uid,
      updateUserDto,
    );

    return this.sanitizeUserDataIfNeeded(updated, request);
  }

  /**
   * Follow a restaurant and optionally set notifications.
   */
  @Post('follow-restaurant')
  @UseGuards(RoleGuard(UserRole.EATER))
  async FollowRestaurant(
    @Body() data: FollowRestaurantDto,
    @Request() request: RequestWithUser,
  ) {
    return this.userService.followRestaurant(data.restaurant_id, request.user, {
      notifyNewMenu: data.notify_new_nenu ?? true,
      notifyGeneralInfo: data.notify_general_info ?? true,
      notifyLastMinuteTables: data.notify_last_minute_tables ?? true,
      notifyLimitedTimeDishes: data.notify_limited_time_dishes ?? true,
      notifySpecialExperiences: data.notify_special_sxperiences ?? true,
    });
  }

  /**
   * Unfollow a restaurant completely
   */
  @Post('unfollow-restaurant')
  @UseGuards(RoleGuard(UserRole.EATER))
  async UnfollowRestaurant(
    @Body() data: UnfollowRestaurantDto,
    @Request() request: RequestWithUser,
  ) {
    return this.userService.unfollowRestaurant(
      data.restaurant_id,
      request.user,
    );
  }

  /**
   * List the restaurants a user is following, along
   * with their notification preferences for each.
   */
  @Get('following')
  @UseGuards(RoleGuard(UserRole.EATER))
  async getFollowRelations(@Request() request: RequestWithUser) {
    return this.userService.getFollowRelations(request.user);
  }

  /**
   * Get a single user.
   */
  @Get(':uid')
  @UseGuards(RoleGuard(UserRole.EATER))
  async getUser(
    @Param('uid') uid: string,
    @Request() request: RequestWithUser,
  ): Promise<Partial<User>> {
    if (!this.isAdmin(request) && uid !== request.user.uid) {
      throw new ForbiddenException();
    }

    const user = await this.userService.getUser(uid);
    return this.sanitizeUserDataIfNeeded(user, request);
  }

  private isAdmin(request: RequestWithUser): boolean {
    return request.user.roles.includes(UserRole.ADMIN);
  }

  /** Remove sensitive user-data for non-admins. */
  private sanitizeUserDataIfNeeded(
    user: Partial<User>,
    request: RequestWithUser,
  ) {
    if (request.user.roles.includes(UserRole.ADMIN)) {
      return user;
    }

    return {
      ...user,

      // The following properties are only visible to Admins.
      stripe_customer_id: this.isAdmin(request)
        ? user.stripe_customer_id
        : null,
    };
  }
}
