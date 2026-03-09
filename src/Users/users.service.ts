import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // CREATE USER
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const { password: _, ...result } = savedUser;

    return result;
  }

  // GET ALL USERS
  async findAll() {
    return this.userRepository.find({
      select: ['id', 'email', 'createdAt'],
    });
  }

  // GET USER BY ID
  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // FIND USER BY EMAIL
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // DELETE USER
  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }
}