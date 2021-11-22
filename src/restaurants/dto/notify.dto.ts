import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class NotifyDto {
  // From Firestore login. Admin or a valid restaurant
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @IsString()
  @IsNotEmpty()
  templateId: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsInt()
  scheduleFor: number;
}

export default NotifyDto;
