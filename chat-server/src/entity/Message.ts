import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from "typeorm";
import { User } from './User';

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, user => user.sendMessages, { nullable: false, onDelete: "CASCADE" })
    sender: User

    // this field is not needed in general,  but it is required if you want to access the senderId and not want to join the sender
    @RelationId((msg: Message) => msg.sender)
    senderId: number

    @ManyToOne(type => User, user => user.receivedMessages, { nullable: false, onDelete: "CASCADE" })
    receiver: User

    // this field is not needed in general,  but it is required if you want to access the receiverId and not want to join the receiver
    @RelationId((msg: Message) => msg.receiver)
    receiverId: number

    @Column({ nullable: false })
    content: string

    @Column({ nullable: true })
    sendDate: Date

    @Column({ nullable: true })
    receivedDate: Date

    @Column({ nullable: true })
    readDate: Date
}
