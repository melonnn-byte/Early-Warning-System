import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ok } from '../common/api-response';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

interface LoginRequest {
  email: string;
  password: string;
}

// Interface baru untuk request pendaftaran
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RefreshRequest {
  refreshToken: string;
}

interface GoogleLoginRequest {
  idToken: string;
}

// Interface untuk memberi tahu TypeScript isi dari objek Request setelah melewati AuthGuard
interface AuthenticatedRequest {
  user: {
    email: string;
    id: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- ENDPOINT REGISTER BARU ---
  @Post('register')
  @HttpCode(201) // 201 Created
  async register(@Body() body: RegisterRequest) {
    const data = await this.authService.register(body);
    return ok(data);
  }

  // --- ENDPOINT LOGIN ---
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginRequest) {
    const data = await this.authService.login(body);
    return ok(data);
  }

  // --- ENDPOINT REFRESH ---
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: RefreshRequest) {
    const data = await this.authService.refresh(body.refreshToken);
    return ok(data);
  }

  // --- ENDPOINT GOOGLE LOGIN ---
  @Post('google-login')
  @HttpCode(200)
  async googleLogin(@Body() body: GoogleLoginRequest) {
    const data = await this.authService.googleLogin(body.idToken);
    return ok(data);
  }

  // --- ENDPOINT LOGOUT ---
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Request() req: AuthenticatedRequest) {
    return ok({ message: `Logout berhasil untuk user: ${req.user.email}` });
  }
}
