import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface UserPayload {
  userId: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'yourSecretKey',
    });
  }

  async validate(payload: unknown): Promise<UserPayload> {
    // TODO
    return {
      userId: (payload as UserPayload).userId,
      username: (payload as UserPayload).username,
    };
  }
}
