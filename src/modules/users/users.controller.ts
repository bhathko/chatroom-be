import { Body, Controller, HttpCode, HttpException, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('create')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    if (!user) {
      throw new HttpException('User already exists', 400);
    }
    return { message: 'User created successfully' };
  }
}
