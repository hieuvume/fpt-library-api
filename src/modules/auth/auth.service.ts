import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"; // Sử dụng nếu bạn dùng JWT
import * as bcrypt from "bcryptjs";
import { UserRepository } from "modules/user/user.repository";

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(
    email: string,
    password: string,
    full_name: string,
    phone_number: string
  ) {
    const userExists = await this.userRepository.findOneByEmail(email);
    if (userExists) {
      throw new BadRequestException({
        message: ["Email is already exists"],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      full_name,
      phone_number,
    });

    const payload = { sub: newUser._id, email: newUser.email, id: newUser._id };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      access_token: accessToken,
      user: newUser,
    };
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException({
        message: ["Email or password is not correct"],
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException({
        message: ["Email or password is not correct"],
      });
    }

    const payload = { sub: user._id, email: user.email, id: user._id };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      access_token: accessToken,
      user: user,
    };
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async signInViaGoogle(googleUser: any) {
    const { email, full_name } = googleUser;

    // Kiểm tra xem người dùng đã tồn tại trong hệ thống chưa
    let user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      // Nếu người dùng chưa tồn tại, tạo mới người dùng
      user = await this.userRepository.create({
        email,
        full_name,
        password: null,  // Không cần mật khẩu cho người dùng Google
        phone_number: '',  // Không cần số điện thoại cho người dùng Google
      });
    }

    const payload = { sub: user._id, email: user.email, id: user._id };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user,
    };
  }

}
