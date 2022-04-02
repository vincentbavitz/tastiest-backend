import { IsString } from 'class-validator';

/** We get userID from the request's JWT token */
class UnfollowRestaurantDto {
  @IsString()
  restaurantId: string;
}

export default UnfollowRestaurantDto;
