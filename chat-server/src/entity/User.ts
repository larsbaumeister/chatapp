import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from "typeorm"
import { Message } from "./Message"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true, nullable: false})
    email: string

    @Column({nullable: false})
    username: string

    @Column({nullable: false})
    password: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    birthday: Date

    @OneToMany(type => Message, message => message.sender)
    sendMessages: Message[]

    @OneToMany(type => Message, message => message.receiver)
    receivedMessages: Message[]

    @ManyToMany(type => User, {onDelete: "CASCADE"})
    @JoinTable({name: 'friends'})
    friends: User[]
}
  