import { Connection } from "typeorm"
import { User } from "../entity/User"
import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { MessageRepository } from "../repo/MessageRepository"
import { UserRepository } from "../repo/UserRepository"
import { getRepo, JWT_SECRET, CTX } from ".."
import { AuthenticationError, withFilter } from "apollo-server"
import { PUB_SUB, EventType } from "./Events"
import { EventEmitter } from "typeorm/platform/PlatformTools"

async function login(ctx, email: string, password: string) {
    const foundUser = await getRepo(ctx, UserRepository).findOneOrFail({email})
    if (foundUser && await compare(password, foundUser.password)) {
        const tokenData = {
            id: foundUser.id,
            username: foundUser.username,
            roles: ['ADMIN', 'SUPERVISOR']
        }

        return {
            token: sign(tokenData, JWT_SECRET, { expiresIn: '30d' }),
            user: foundUser
        }
    } else 
        throw new AuthenticationError('incorrect username or password')
}   

export const UserGql =  {
    
    typeDefinition: `
        type User {
            id: Int
            email: String
            username: String
            firstName: String
            lastName: String
            birthday: Date
            sendMessages: [Message]
            receivedMessages: [Message]
            friends: [User]
        }
        
        type LoginResponse {
            token: String
            user: User
        }

        input UserRegisterInput {
            id: Int
            username: String!
            email: String!
            password: String
            firstName: String
            lastName: String
            birthday: Date
        }


        type Query {
            users(id: Int): [User]
            login(email: String!, password: String!): LoginResponse
        }

        type Mutation {
            registerUser(user: UserRegisterInput): User
            addFriend(id1: Int!, id2: Int!): User
            removeFriend(id1: Int!, id2: Int!): User
            removeUser(userId: Int!): Int
        }
        
        type Subscription {
            userLoggedIn: User
            userRegistered: User
        }`,

    resolver: {
        Query: {
            users: async (parent, { id }, ctx: CTX) => {
                if(id)
                    return await getRepo(ctx, UserRepository).find({ id })
                else
                    return await getRepo(ctx, UserRepository).find()
            },
            login: async (parent, {email, password}, ctx: CTX) => {
                const token = await login(ctx, email, password)
                if (token?.user?.id) // check if the login was successfull
                    PUB_SUB.publish(EventType.UserLoggedIn, { userLoggedIn: token.user})

                return token
            }
        },
        Mutation: {
            registerUser: async (parent, {user}, ctx: CTX) => {
                let isNewUser = true
                if (user.password) {
                    // if the password was set, we hash it and store it into the database
                    user.password = await hash(user.password, 10)
                }
                else if (user.id) {
                    // if the password has not been set, we want to leave it as it is, therefore we fetch the current password from the database
                    user.password = (await getRepo(ctx, UserRepository).findOneOrFail({id: user.id})).password
                    isNewUser = false
                }
                    
                const savedUser: User = await getRepo(ctx, UserRepository).save(user)
                if (isNewUser)
                    PUB_SUB.publish(EventType.UserRegistered, { userRegistered: savedUser })

                return savedUser
            },
            addFriend: async  (parent, {id1, id2}, ctx: CTX) => {
                const user = await getRepo(ctx, UserRepository).addFriend(id1, id2)
                PUB_SUB.publish(EventType.FriendAdded, { user, addedFriendId: id2 })
                return user
            },
            removeFriend: async (parent, {id1, id2}, ctx: CTX) => {
                const user = await getRepo(ctx, UserRepository).removeFriend(id1, id2)
                PUB_SUB.publish(EventType.FriendRemoved, { user, removedFriendId: id2 })
                return user
            },
            removeUser: async  (parent, {userId}, ctx: CTX) => {
                const id = await getRepo(ctx, UserRepository).removeUser(userId)
                PUB_SUB.publish(EventType.UserRemoved, { removedUserId: id })
                return id
            }
        },
        Subscription: {
            userLoggedIn: {
                subscribe: withFilter(() => PUB_SUB.asyncIterator(EventType.UserLoggedIn), (payload, args) => true )
            },
            userRegistered: {
                subscribe: () => PUB_SUB.asyncIterator(EventType.UserRegistered)
            }
        },
        User: {
            sendMessages: async (parent, args, ctx: CTX) => await getRepo(ctx, MessageRepository).findBySender(parent.id),
            receivedMessages: async (parent, args, ctx: CTX) => await getRepo(ctx, MessageRepository).findByReceiver(parent.id),
            friends: async (parent, args, ctx: CTX) => await getRepo(ctx, UserRepository).findFriendsForUser(parent.id)
        }
    }
}

