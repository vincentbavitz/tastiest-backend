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
  @Get()
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
    return this.userService.getUser(request.user.uid);
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

    return {
      ...updated,

      // Only Admins may view these properties
      id: this.isAdmin(request) ? updated.id : undefined,
      stripe_setup_secret: this.isAdmin(request)
        ? updated.stripe_setup_secret
        : undefined,
      stripe_customer_id: this.isAdmin(request)
        ? updated.stripe_customer_id
        : undefined,
    };
  }

  /**
   * Follow a restaurant and optionally set notifications.
   */
  @Post('follow-restaurant')
  @UseGuards(RoleGuard(UserRole.EATER))
  async FollowRestaurant(
    @Body() followRestaurantDto: FollowRestaurantDto,
    @Request() request: RequestWithUser,
  ) {
    return this.userService.followRestaurant(
      followRestaurantDto.restaurantId,
      request.user,
      {
        notifyNewMenu: true,
        notifyGeneralInfo: true,
        notifyLastMinuteTables: true,
        notifyLimitedTimeDishes: true,
        notifySpecialExperiences: true,
        ...followRestaurantDto,
      },
    );
  }

  /**
   * Unfollow a restaurant completely
   */
  @Post('unfollow-restaurant')
  @UseGuards(RoleGuard(UserRole.EATER))
  async UnfollowRestaurant(
    @Body() unfollowRestaurantDto: UnfollowRestaurantDto,
    @Request() request: RequestWithUser,
  ) {
    return null;
  }

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
      stripe_setup_secret: this.isAdmin(request)
        ? user.stripe_setup_secret
        : undefined,
      stripe_customer_id: this.isAdmin(request)
        ? user.stripe_customer_id
        : undefined,
    };
  }

  private isAdmin(request: RequestWithUser): boolean {
    return request.user.roles.includes(UserRole.ADMIN);
  }
}
