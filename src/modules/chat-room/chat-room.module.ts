import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { User } from '../users/entities/user.entity';
import { CoreModule } from '../core/core.module';

@Module({
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  imports: [CoreModule, TypeOrmModule.forFeature([ChatRoom, User])],
})
export class ChatRoomModule {}
