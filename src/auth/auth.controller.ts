import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Response,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from './dto/user.dto';
import { RegistrationStatus, ResponseToken } from './interfaces/auth.interface';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDTO, @Response() res: Res) {
    const token: ResponseToken = await this.authService.login(loginUserDto);
    return res
      .set('Authorization', `Bearer ${token.accessToken}`)
      .json({ token });
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDTO) {
    const result: RegistrationStatus = await this.authService.signUp(
      createUserDto,
    );
    if (!result.succes) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
