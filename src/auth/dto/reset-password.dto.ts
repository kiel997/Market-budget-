// src/auth/dto/reset-password.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string; // or token if using link method

  @IsString()
  @MinLength(6)
  newPassword: string;
}
