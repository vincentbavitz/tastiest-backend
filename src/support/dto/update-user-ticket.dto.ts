import {
  RestaurantSupportRequest,
  SupportRequestType,
} from '@tastiest-io/tastiest-utils';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

class UpdateUserTicketDto {
  // From Firestore login. Admin or a valid restaurant
  @IsNotEmpty()
  @IsString()
  token: string;

  /** The corresponding ticket ID from its Firestore entry. */
  @IsNotEmpty()
  @IsString()
  ticketId: string;

  // /////////////////////////////////////////////////////
  // Everything below are available options to update   //
  // /////////////////////////////////////////////////////
  @IsOptional()
  @IsBoolean()
  resolved: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['critical', 'high', 'normal', 'low'])
  priority: RestaurantSupportRequest['priority'];

  @IsString()
  @IsOptional()
  @IsIn(['GENERAL', 'ORDER', 'OTHER', 'BUG', 'FEATURE_REQUEST'])
  type: SupportRequestType;
}

export default UpdateUserTicketDto;
