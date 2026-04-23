import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // 1. Parameter '_info' dan seterusnya dihapus karena tidak dipakai
  handleRequest<TUser = AuthUser>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      // 2. Pastikan yang dilempar (throw) SELALU berupa instance dari Error
      if (err instanceof Error) {
        throw err;
      }
      throw new UnauthorizedException('Silakan login terlebih dahulu.');
    }

    return user;
  }
}
