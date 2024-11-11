import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('chat-rooms/:chatRoomId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(
    @Param('chatRoomId') chatRoomId: string,
    @Request() request,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(
      chatRoomId,
      request.user,
      createMessageDto,
    );
  }
  @Get()
  findAll(
    @Param('chatRoomId') chatRoomId: string,
    @Query('page') page: number = 1,
    @Query('limit') take: number = 50,
  ) {
    return this.messagesService.findAll({ page, take }, chatRoomId);
  }
}
