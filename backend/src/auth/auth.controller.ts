import {
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ok } from '../common/api-response';
import { AuthService } from './auth.service';

interface LoginRequest {
  email: string;
  password: string;
}

interface RefreshRequest {
  refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginRequest) {
    const data = await this.authService.login(body);
    return ok(data);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: RefreshRequest) {
    const data = await this.authService.refresh(body.refreshToken);
    return ok(data);
  }

  @Post('logout')
  @HttpCode(200)
  logout() {
    return ok({ message: 'Logout berhasil.' });
  }
}
