import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository ) {}
  async profile(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
  async updateProfile(id: string, data : any) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.userRepository.updateUser(id, data);
  }
  

  async changePassword(id: string, data : any) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.password !== data.oldPassword) {
      throw new UnauthorizedException();
    }
    return this.userRepository.changePassword(id, data.password);
  }

  async findAll() {
    return this.userRepository.findAll();
  }
}

