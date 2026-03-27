import {Controller,Post,Patch,Body,Req,UseGuards,BadRequestException,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import {authSchema,emailSchema, resetPasswordSchema,changePasswordSchema,} from './schema/auth.schema';
import { ZodError } from 'zod';

// Request type
interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // SIGNUP
  @Post('signup')
  async signup(@Body() body: any) {
    try {
      const validated = authSchema.parse(body);

      return this.authService.signup(
        validated.email,
        validated.password,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(
          error.issues.map((e) => e.message),
        );
      }
      throw error;
    }
  }

  // LOGIN
  @Post('login')
  async login(@Body() body: any) {
    try {
      const validated = authSchema.parse(body);

      return this.authService.login(
        validated.email,
        validated.password,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(
          error.issues.map((e) => e.message),
        );
      }
      throw error;
    }
  }

 
  @Post('forgot-password')
  async forgotPassword(@Body() body: any) {
    try {
      const validated = emailSchema.parse(body);

      return this.authService.forgotPassword(validated.email);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(
          error.issues.map((e) => e.message),
        );
      }
      throw error;
    }
  }

  
  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    try {
      const validated = resetPasswordSchema.parse(body);

      return this.authService.resetPassword(
        validated.email,
        validated.otp,
        validated.newPassword,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(
          error.issues.map((e) => e.message),
        );
      }
      throw error;
    }
  }

 
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: any,
  ) {
    try {
      const validated = changePasswordSchema.parse(body);

      return this.authService.changePassword(
        req.user.sub,
        validated.newPassword,
        validated.oldPassword,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(
          error.issues.map((e) => e.message),
        );
      }
      throw error;
    }
  }
}
