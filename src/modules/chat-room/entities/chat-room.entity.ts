import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';
import { ChatRoomUnread } from './chat-room-unread.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.ownedChatRooms)
  owner: User;

  @ManyToMany(() => User, (user) => user.chatRooms)
  members: User[];

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Array<Message>;

  @OneToMany(() => ChatRoomUnread, (chatRoomUnread) => chatRoomUnread.user)
  chatRoomUnreads: Array<ChatRoomUnread>;
}
