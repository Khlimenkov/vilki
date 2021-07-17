import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, LoginUserDTO, UserDTO } from 'src/auth/dto/user.dto';
import { JwtPayload } from 'src/auth/interfaces/auth.interface';
import { toUserDto } from 'src/auth/utils/mapper';
import { User, UserDocument } from 'src/user/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async hashPassword(pass: string): Promise<string> {
    const hashPass = await bcrypt.hash(
      pass,
      this.configService.get<string>('SALT'),
    );
    return hashPass;
  }

  async comparePassword(userpass: string, pass: string): Promise<boolean> {
    const areEqual = await bcrypt.compare(pass, userpass);
    return areEqual;
  }

  async findForUsername(username: string): Promise<UserDTO> {
    const user = await this.userModel.findOne({ username });
    return toUserDto(user);
  }

  async findByPayload(payload: JwtPayload): Promise<UserDTO> {
    return await this.findForUsername(payload.username);
  }

  async findByLogin({ username, password }: LoginUserDTO): Promise<UserDTO> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const areEqual = await this.comparePassword(user.password, password);
    if (!areEqual) {
      throw new HttpException('Invalid pass', HttpStatus.UNAUTHORIZED);
    }
    return toUserDto(user);
  }

  async createUser(userDto: CreateUserDTO): Promise<UserDTO> {
    const { username, password, email } = userDto;

    const userInDb = await this.userModel.findOne({ username });
    const hashPswrd = await this.hashPassword(password);
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user: UserDocument = await this.userModel.create({
      username,
      password: hashPswrd,
      email,
    });
    return toUserDto(user);
  }
}
