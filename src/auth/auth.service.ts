import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO, LoginUserDTO, UserDTO } from './dto/user.dto';
import {
  JwtPayload,
  RegistrationStatus,
  ResponseToken,
  Token,
} from './interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private _createToken({ username }: UserDTO): Token {
    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    const refreshToken = randomUUID();
    return {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
      accessToken,
      refreshToken,
    };
  }
  async signUp(userDto: CreateUserDTO): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      succes: true,
      message: 'user registered',
    };
    try {
      await this.usersService.createUser(userDto);
    } catch (e) {
      status = {
        succes: false,
        message: e,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDTO): Promise<ResponseToken> {
    const user = await this.usersService.findByLogin(loginUserDto);

    const token = this._createToken(user);
    const tokenResponse: ResponseToken = {
      username: user.username,
      ...token,
    };
    return tokenResponse;
  }

  async validateUser(payload: JwtPayload): Promise<UserDTO> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
