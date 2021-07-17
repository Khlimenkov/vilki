import { IsEmail, IsString } from 'src/decorators/decorators.dto';

export class LoginUserDTO {
  @IsString({ minLenght: 2, example: 'Alexey' })
  username: string;
  @IsString({ minLenght: 8, example: '123213wqe' })
  password: string;
}

export class CreateUserDTO extends LoginUserDTO {
  @IsEmail({ minLenght: 2, example: 'xlimenkov4@gmail.com' })
  email: string;
}

export class UserDTO {
  @IsString({ minLenght: 0, example: '12312dewaw342adfadfww' })
  id: string;
  @IsString({ minLenght: 2, example: 'Alexey' })
  username: string;
  @IsEmail({ minLenght: 2, example: 'xlimenkov4@gmail.com' })
  email: string;
}
