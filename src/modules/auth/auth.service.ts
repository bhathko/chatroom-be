import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async generateToken(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = { account: user.account, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const auth = this.authRepository.create({
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      user,
    });
    await this.authRepository.save(auth);
    return { accessToken, refreshToken };
  }

  async validateToken(token: string): Promise<User> {
    const auth = await this.authRepository.findOne({
      where: { accessToken: token },
      relations: ['user'],
    });
    if (!auth || auth.expiresAt < new Date()) {
      throw new Error('Invalid token');
    }
    return auth.user;
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const auth = await this.authRepository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });
    if (!auth || auth.expiresAt < new Date()) {
      throw new Error('Invalid token');
    }
    await this.authRepository.delete(auth.id);
    return this.generateToken(auth.user);
  }
}
