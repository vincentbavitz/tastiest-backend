import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

class ReplyToTicketDto {
  /** The corresponding ticket ID from its Firestore entry. */
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;
}

export default ReplyToTicketDto;
