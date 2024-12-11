import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ChatRoom } from '../../chat-room/entities/chat-room.entity';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Message } from 'src/modules/messages/entities/message.entity';
import { ChatRoomUnread } from 'src/modules/chat-room/entities/chat-room-unread.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  displayName: string;

  @Column({ unique: true })
  account: string;

  @Column()
  birthday: Date;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.owner)
  ownedChatRooms: ChatRoom[];

  @ManyToMany(() => ChatRoom, (chatRoom) => chatRoom.members)
  @JoinTable()
  chatRooms: ChatRoom[];

  @OneToMany(() => Auth, (auth) => auth.user)
  authTokens: Auth[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => ChatRoomUnread, (chatRoomUnread) => chatRoomUnread.chatRoom)
  chatRoomUnreads: ChatRoomUnread[];
}
