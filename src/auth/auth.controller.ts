// src/auth/auth.controller.ts
import { Controller, Post, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard'; 
import { Request } from 'express';


interface AuthenticatedRequest extends Request {
  user: { sub: string; [key: string]: any };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // SIGNUP
  @Post('signup')
  async signup(@Body() body: { email: string; password: string }) {
    return this.authService.signup(body.email, body.password);
  }

  // LOGIN
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // FORGOT PASSWORD → OTP
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  // RESET PASSWORD using OTP
  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; otp: string; newPassword: string },
  ) {
    return this.authService.resetPassword(
      body.email,
      body.otp,
      body.newPassword,
    );
  }

  
  @UseGuards(JwtAuthGuard) 
  @Patch('change-password')
  async changePassword(
    @Req() req: AuthenticatedRequest, 
    @Body() body: { newPassword: string; oldPassword?: string },
  ) {
    const userId = req.user['sub']; // JWT payload contains userId in 'sub'
    return this.authService.changePassword(
      userId,
      body.newPassword,
      body.oldPassword,
    );
  }
}