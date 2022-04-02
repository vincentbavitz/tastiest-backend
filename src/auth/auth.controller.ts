import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import RegisterDto from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('public/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.createUser(registerDto);
  }
}
