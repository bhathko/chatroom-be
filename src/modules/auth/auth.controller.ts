import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    if (!user) {
      throw new HttpException('User already exists', 400);
    }
    return { message: 'User created successfully' };
  }

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.userService.passwordVerify(createAuthDto);
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
    const tokens = await this.authService.generateToken(user);
    return tokens;
  }

  @Post('refresh')
  async refresh(@Body() { refreshToken }: { refreshToken: string }) {
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return { accessToken, refreshToken };
  }

  @Get('me')
  async me() {
    return { message: 'You are authorized' };
  }
}
