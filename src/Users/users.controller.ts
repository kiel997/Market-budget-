import { Controller, Post, Body, Param, Get, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET ALL USERS
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET USER BY ID
  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOneById(id);
  }

  // CREATE USER
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // DELETE USER BY ID
  @Delete(':id')
  deleteUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.removeById(id);
  }

  
}
