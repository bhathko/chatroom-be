import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoreModule } from '../core/core.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    CoreModule,
    UsersModule,
    TypeOrmModule.forFeature([Auth]),
  ],
})
export class AuthModule {}
