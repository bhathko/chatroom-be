import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ChatRoom } from "./chat-room.entity";

@Entity()
@Unique(['userId', 'chatRoomId'])
export class ChatRoomUnread {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => User, (user) => user.chatRoomUnreads)
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chatRoomUnreads)
    @JoinColumn({ name: 'chatRoomId' })
    chatRoom: ChatRoom;
  
    @Column()
    userId: string;
  
    @Column()
    chatRoomId: string;
  
    @Column()
    lastReadTimeStamp: Date;
}