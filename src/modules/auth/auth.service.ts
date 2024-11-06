import { fakerVI } from "@faker-js/faker";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"; // Sử dụng nếu bạn dùng JWT
import * as bcrypt from "bcryptjs";
import { MembershipCardService } from "modules/membership-card/membership-card.service";
import { RoleRepository } from "modules/role/role.repository";
import { UserRepository } from "modules/user/user.repository";
import { badMessage } from "utils/helpers";

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private jwtService: JwtService,
    private membershipCardService: MembershipCardService
  ) {}

  async signUp(
    email: string,
    password: string,
    full_name: string,
    phone_number: string
  ) {
    const userExists = await this.userRepository.findOneByEmail(email);
    if (userExists) {
      return badMessage("email", "Email is already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await this.roleRepository.findByName("USER");

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      full_name,
      phone_number,
      role: userRole,
      avatar_url: fakerVI.image.avatar(),
    });

    const membershipCard = await this.membershipCardService.initMembershipCard(
      newUser._id
    );

    // this.userRepository.updateCurrentMembership(newUser._id.toString(), membershipCard);
    newUser.current_membership = membershipCard;
    newUser.save();

    const payload = {
      sub: newUser._id,
      email: newUser.email,
      id: newUser._id,
      role: newUser.role.role_name,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: newUser,
    };
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      return badMessage("password", "Email or password is not correct");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return badMessage("password", "Email or password is not correct");
    }

    const payload = { sub: user._id, email: user.email, id: user._id };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      access_token: accessToken,
      user: user,
    };
  }

  async getProfile(id: string) {
    const user = await this.userRepository.getProfile(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async signInViaGoogle(googleUser: any) {
    const { email, name } = googleUser;

    let user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      const userRole = await this.roleRepository.findByName("USER");
      user = await this.userRepository.create({
        email,
        full_name: name,
        password: null,
        phone_number: null,
        role: userRole,
        avatar_url: fakerVI.image.avatar(),
      });

      const membershipCard =
        await this.membershipCardService.initMembershipCard(user._id);
      user.current_membership = membershipCard;
      user.save();
    }

    const payload = {
      sub: user._id,
      email: user.email,
      id: user._id,
      role: user.role.role_name,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user,
    };
  }
}
