import { RestaurantSupportRequest } from '@tastiest-io/tastiest-utils';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

class UpdateRestaurantTicketDto {
  // From Firestore login. Admin or a valid restaurant
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  /** The corresponding ticket ID from its Firestore entry. */
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  // /////////////////////////////////////////////////////
  // Everything below are available options to update   //
  // /////////////////////////////////////////////////////

  @IsBoolean()
  resolved: boolean;

  @IsString()
  priority: RestaurantSupportRequest['priority'];
}

export default UpdateRestaurantTicketDto;
