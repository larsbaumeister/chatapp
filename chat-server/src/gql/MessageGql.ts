import { Connection } from "typeorm"
import { Message } from "../entity/Message"
import { gql, UserInputError, AuthenticationError } from 'apollo-server'
import { MessageRepository } from "../repo/MessageRepository"
import { getRepo, CTX } from ".."
import { UserRepository } from "../repo/UserRepository"
import { PUB_SUB, EventType } from "./Events"

export const MessageGql = {

    typeDefinition: `
        type Message {
            id: Int!
            sender: User!
            receiver: User!
            content: String!
            sendDate: Date
            receivedDate: Date
            readDate: Date
        }
        
        input SendMessageInput {
            senderId: Int!
            receiverId: Int!
            content: String!
        }

        type Query {
            messages: [Message]
            loadChat(user1Id: Int!, user2Id: Int!): [Message]
            loadChats(userId: Int): [Message]
        }

        type Mutation {
            sendMessage(message: SendMessageInput): Message
            receiveMessage(messageId: Int!): Message
            readMessage(messageId: Int!): Message
        }`,

    resolver: {
        Query: {
            messages: async (parent, args, ctx: CTX) => await getRepo(ctx, MessageRepository).find(),
            loadChat: async (parent, {user1Id, user2Id}, ctx: CTX) => await getRepo(ctx, MessageRepository).findMessageForChat(user1Id, user2Id)
        },
        Mutation: {
            sendMessage: async (parent, {message}, ctx: CTX) => {
                message.sender = { id: message.senderId }
                message.receiver = { id: message.receiverId }
                message.sendDate = new Date()

                const savedMessage: Message = await getRepo(ctx, MessageRepository).save(message)
                PUB_SUB.publish(EventType.MessageSend, savedMessage)
                return savedMessage
            },
            receiveMessage: async (parent, {messageId}, ctx: CTX) => {
                const msgRepo = getRepo(ctx, MessageRepository)
                const message = await msgRepo.findOneOrFail({id: messageId})
                
                // check if the send date was not set before and that the caller is the actual receiver or the message
                if (ctx.auth.isAdmin || (message.receivedDate === null && ctx.auth.id === message.receiverId))
                    message.receivedDate = new Date()
                else
                    throw new AuthenticationError('You are not permitted to do this!')

                const savedMessage: Message = await msgRepo.save(message)
                PUB_SUB.publish(EventType.MessageReceived, savedMessage)
                return savedMessage
            },
            readMessage: async (parent, {messageId}, ctx: CTX) => {
                const msgRepo = getRepo(ctx, MessageRepository)
                const message = await msgRepo.findOneOrFail({id: messageId})

                if (ctx.auth.isAdmin || (message.readDate == null && ctx.auth.id === message.receiverId))
                    message.readDate = new Date()
                else
                    throw new AuthenticationError('You are not permitted to do this!')

                const savedMessage: Message = await msgRepo.save(message)
                PUB_SUB.publish(EventType.MessageRead, savedMessage)
                return savedMessage
            }
        },
        Message: {
            sender: async (message: Message, args, ctx: CTX) => await getRepo(ctx, UserRepository).findOneOrFail({id: message.senderId}),
            receiver: async (message: Message, args, ctx: CTX) => await getRepo(ctx, UserRepository).findOneOrFail({id: message.receiverId}),
        }
    }
}
