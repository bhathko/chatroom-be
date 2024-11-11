import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { CoreModule } from '../core/core.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [CoreModule],
})
export class MessagesModule {}
