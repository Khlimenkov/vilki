import { UserDocument } from 'src/user/user.schema';
import { UserDTO } from '../dto/user.dto';

export const toUserDto = (data: UserDocument): UserDTO => {
  const { id, username, email } = data;
  const userDto: UserDTO = { id, username, email };
  return userDto;
};
