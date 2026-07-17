import { LogingDataDto } from './../dto/loginData.dtro';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from '../dto/regiserUser.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registerUserDto: RegisterUserDto) {
    const hash = await bcrypt.hash(registerUserDto.password, 10);
    const { success, message, data } = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });
    if (success) {
      console.log(message);
      return {
        success,
        message,
        data,
      };
    }
    console.log(message);
    return {
      success,
      message,
      data,
    };
  }

  async logedUser(logingDataDto: LogingDataDto) {
    const { success, message, data } = await this.userService.findUserWithEmail(
      logingDataDto.email,
    );
    if (success) {
      console.log(message);
      const isMatch = await bcrypt.compare(
        logingDataDto.password,
        data.password,
      );

      if (!isMatch) {
        return {
          success: false,
          message: 'Wrong Password',
          data: null,
        };
      }

      const accessToken = await this.jwtService.signAsync({
        id: data.id,
        email: data.email,
      });

      return {
        success: true,
        message: 'Login Successfully',
        data,
        accessToken,
      };
    }

    console.log(message);
    return {
      success,
      message,
      data,
    };
  }
}
