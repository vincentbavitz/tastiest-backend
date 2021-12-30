import { IsNotEmpty, IsString } from 'class-validator';

class ReplyToTicketDto {
  /** The corresponding ticket ID from its Firestore entry. */
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export default ReplyToTicketDto;
