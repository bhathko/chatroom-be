import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  Patch,
  Param,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('chat-room')
@UseGuards(JwtAuthGuard)
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get('list')
  findAll(@Query('page') page: number = 1, @Query('limit') take: number = 10) {
    return this.chatRoomService.findAll({ page, take });
  }

  @Post()
  create(@Body() createChatrRoomDto: CreateChatRoomDto, @Request() request) {
    return this.chatRoomService.create(createChatrRoomDto, request.user);
  }

  @Patch()
  update(@Body() joinChatRoomDto: UpdateChatRoomDto, @Request() request) {
    return this.chatRoomService.update(joinChatRoomDto, request.user);
  }

  @Get(':id')
  findOne(@Request() request, @Param('id') id: string) {
    return this.chatRoomService.findOne(id, request.user);
  }

}
