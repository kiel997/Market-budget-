// src/Auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../Users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const user = await this.usersService.create({ email, password });
    return { message: 'User created successfully', user };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };

    return { access_token: this.jwtService.sign(payload) };
  }
}