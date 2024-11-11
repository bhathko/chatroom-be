import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { CoreModule } from '../core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from '../chat-room/entities/chat-room.entity';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [CoreModule,
    TypeOrmModule.forFeature([Message, User, ChatRoom])
  ],
})
export class MessagesModule {}
