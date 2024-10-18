import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: 'GOOGLE_CLIENT_ID',  // Thay bằng Client ID từ Google Cloud
      clientSecret: 'GOOGLE_CLIENT_SECRET',  // Thay bằng Client Secret từ Google Cloud
      callbackURL: 'http://localhost:3000/auth/google/callback',  // URL callback sau khi đăng nhập
      scope: ['email', 'profile'],  // Lấy thông tin email và profile
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      full_name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}