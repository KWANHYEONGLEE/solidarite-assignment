import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  // * JWT Guard를 통과하지 못했을때 -> false return
  handleRequest(err, user, info) {
    if (err || !user) {
      return false;
    }
    return user;
  }
}
