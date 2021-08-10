import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): any => {
          const auth = request?.headers.authorization;
          return auth;
        },
      ]),
      secretOrKey: process.env.JWT_SECREAT_KEY,
    });
  }

  async validate(payload: TokenPayload) {
    return this.usersService.getUserById(payload.userId);
  }
}
