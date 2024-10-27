import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserDto } from "./dto/user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async profile(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async updateAvatar(id: string, avatar_url: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log(avatar_url);
    return this.userRepository.updateUser(id, { avatar_url });
  }

  async updateProfile(id: string, data: any) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.userRepository.updateUser(id, data);
  }

  async updatePassword(
    id: string,
    current_password: string,
    new_password: string
  ) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordMatch = await bcrypt.compare(
      current_password,
      user.password
    );
    if (!isPasswordMatch) {
      throw new BadRequestException({
        message: [
          {
            property: "current_password",
            message: "Current password is not correct",
          },
        ],
      });
    }
    const newPassword = await bcrypt.hash(new_password, 10);
    return this.userRepository.updatePassword(user._id, newPassword);
  }
}
