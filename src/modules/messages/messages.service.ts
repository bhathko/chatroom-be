import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../chat-room/entities/chat-room.entity';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';
import { ChatGateway } from 'src/gateway/chat/chat.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChatRoom)
    private readonly chatroomRepository: Repository<ChatRoom>,
    private readonly chatGateway: ChatGateway,
  ) {}

  async create(
    chatRoomId: string,
    user: { sub: string },
    createMessageDto: CreateMessageDto,
  ) {
    const userInfo = await this.userRepository.findOne({
      where: { id: user.sub },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const chatRoom = await this.chatroomRepository.findOne({
      where: { id: chatRoomId },
    });
    if (!chatRoom) {
      throw new BadRequestException('Chat room not found');
    }
    const message = this.messageRepository.create({
      ...createMessageDto,
      user: userInfo,
      chatRoom,
    });
    const result = await this.messageRepository.save(message);
    this.chatGateway.server.to(chatRoomId).emit('message', result);
    return result;
  }

  findAll({ page, take }: { page: number; take: number }, chatRoomId: string) {
    const skip = (page - 1) * take;
    return this.messageRepository
      .findAndCount({
        take,
        skip,
        relations: ['user', 'chatRoom'],
        where: {
          chatRoom: {
            id: chatRoomId,
          },
        },
        order: {
          timestamp: 'DESC',
        },
        select: {
          user: {
            id: true,
            username: true,
          },
          chatRoom: {
            id: true,
            name: true,
          },
        },
      })
      .then(([data, total]) => ({
        data,
        meta: {
          total,
          page,
        },
      }))
      .catch((error) => {
        throw new BadRequestException('Error fetching messages');
      });
  }
}
