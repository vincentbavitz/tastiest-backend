import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

class ApplyDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber('GB')
  contactNumber: string;

  @IsString()
  restaurantName: string;

  @IsUrl()
  @IsString()
  restaurantWebsite: string;

  @IsString()
  restaurantAddress: string;

  // The textarea;
  // 'Please provide a brief description of the experience
  //  that you would like to sell with Tastiest'
  @IsString()
  @MaxLength(2000)
  description: string;
}

export default ApplyDto;
