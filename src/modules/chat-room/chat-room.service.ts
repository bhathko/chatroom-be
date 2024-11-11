import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ChatRoom } from './entities/chat-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatroomRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createChatRoomDto: CreateChatRoomDto, user: { sub: string }) {
    const userInfo = await this.userRepository.findOne({
      where: { id: user.sub },
    });
    if (!userInfo) {
      throw new BadRequestException('User not found');
    }
    const chatRoom = this.chatroomRepository.create({
      ...createChatRoomDto,
      owner: userInfo,
      members: [userInfo],
    });
    return await this.chatroomRepository.save(chatRoom);
  }

  async findAll({ page, take }: { page: number; take: number }) {
    const skip = (page - 1) * take;
    return this.chatroomRepository
      .findAndCount({
        take,
        skip,
        relations: ['members', 'owner'],
        select: {
          owner: {
            id: true,
          },
          members: {
            id: true,
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
        throw new BadRequestException('Error fetching chat rooms');
      });
  }

  async update(updateChatRoomDto: UpdateChatRoomDto, user: { sub: string }) {
    const userInfo = await this.userRepository.findOne({
      where: { id: user.sub },
    });
    if (!userInfo) {
      throw new BadRequestException('User not found');
    }
    const chatRoom = await this.chatroomRepository.findOne({
      where: { id: updateChatRoomDto.id },
      relations: ['members'],
    });
    if (!chatRoom) {
      throw new BadRequestException('Chat room not found');
    }
    if (chatRoom.members.find((member) => member.id === userInfo.id)) {
      throw new BadRequestException('User already in chat room');
    }
    chatRoom.members.push(userInfo);
    return await this.chatroomRepository.save(chatRoom);
  }
}
