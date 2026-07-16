import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/regiserUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
  ) {}
  async createUser(registerUserDto: RegisterUserDto) {
    try {
      const existsUser = await this.userModel.findOne({
        where: {
          email: registerUserDto.email,
        },
      });

      if (existsUser) {
        return {
          success: false,
          message: 'User already exists with this email',
          data: null,
        };
      } else {
        const user = this.userModel.create({
          fName: registerUserDto.fname,
          lName: registerUserDto.lname,
          email: registerUserDto.email,
          password: registerUserDto.password,
        });

        return {
          success: true,
          message: 'Account Created Successfully',
          data: await this.userModel.save(user),
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Internal Error',
        data: null,
      };
    }
  }

  async findUserWithEmail(email: string) {
    try {
      const user = await this.userModel.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'User Not Found In DB Plese Signup First',
          data: null,
        };
      } else {
        return {
          success: true,
          message: 'User Found SuccessFully',
          data: user,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Server Error ',
        data: null,
      };
    }
  }
}
