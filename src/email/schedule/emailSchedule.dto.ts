import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailScheduleDto {
  @IsEmail({}, { each: true })
  recipients: string[];

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  date: string;
}

export default EmailScheduleDto;
