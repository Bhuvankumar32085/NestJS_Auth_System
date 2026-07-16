import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../dto/regiserUser.dto';
import { LogingDataDto } from '../dto/loginData.dtro';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthRequest } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    const res = this.authService.registerUser(registerUserDto);
    return res;
  }

  @Post('login')
  login(@Body() loginDataDtro: LogingDataDto) {
    console.log(loginDataDtro);
    const res = this.authService.logedUser(loginDataDtro);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthRequest) {
    const user = req.user;
    console.log(req.user);
    console.log(user);
    if (!user) {
      return {
        success: false,
        message: 'Pleses Login',
        data: null,
      };
    }
    return {
      success: false,
      message: 'Profile get successfully',
      data: user,
    };
  }
}
