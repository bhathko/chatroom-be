import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existUser) {
      throw new ConflictException('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async passwordVerify(createAuthDto: CreateAuthDto) {
    const user = await this.usersRepository.findOne({
      where: { username: createAuthDto.username },
    });
    if (!user) {
      throw new UnauthorizedException('User or password is incorrect');
    }
    const isPasswordValid = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('User or password is incorrect');
    }
    return user;
  }
}
