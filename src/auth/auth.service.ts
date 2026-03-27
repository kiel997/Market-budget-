import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../Users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // SIGNUP
  async signup(email: string, password: string) {
    const user = await this.usersService.create({ email, password });

    return {
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  // LOGIN
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // FORGOT PASSWORD (SEND OTP)
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = await bcrypt.hash(otp, 10);
    user.resetOtpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await this.usersService.save(user);

    await this.mailService.sendMail(
      email,
      'Password Reset OTP',
      `
      <h2>Your OTP Code</h2>
      <h3>${otp}</h3>
      <p>This OTP expires in 5 minutes</p>
      `,
    );

    return {
      message: 'OTP sent to your email',
    };
  }

  // RESET PASSWORD (WITH OTP)
  async resetPassword(email: string, otp: string, newPassword: string) {
    if (!newPassword) {
      throw new BadRequestException('New password is required');
    }

    if (!otp) {
      throw new BadRequestException('OTP is required');
    }

    const user = await this.usersService.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    if (
      !user.resetOtp ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      throw new UnauthorizedException('OTP expired or invalid');
    }

    const valid = await bcrypt.compare(otp, user.resetOtp);

    if (!valid) throw new UnauthorizedException('Invalid OTP');

    user.password = await bcrypt.hash(newPassword, 10);

    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await this.usersService.save(user);

    return {
      message: 'Password reset successfully',
    };
  }

  // CHANGE PASSWORD (SECURE VERSION)
  async changePassword(
    userId: string,
    newPassword: string,
    oldPassword: string,
  ) {
    
    if (!newPassword) {
      throw new BadRequestException('New password is required');
    }

    if (!oldPassword) {
      throw new BadRequestException('Old password is required');
    }

   
    const user = await this.usersService.findByIdWithPassword(userId);

    if (!user) throw new NotFoundException('User not found');

    // Verify old password
    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    
    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      throw new BadRequestException(
        'New password must be different from old password',
      );
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersService.save(user);

    return {
      message: 'Password changed successfully',
    };
  }
}
