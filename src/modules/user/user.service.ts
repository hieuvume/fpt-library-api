import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';

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

}

