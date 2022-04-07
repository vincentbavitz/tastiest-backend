import { IsString } from 'class-validator';

/** We get userID from the request's JWT token */
class UnfollowRestaurantDto {
  @IsString()
  restaurant_id: string;
}

export default UnfollowRestaurantDto;
