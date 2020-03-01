import { PubSub } from "apollo-server";

export enum EventType {
    MessageSend = 'MESSAGE_SEND',
    MessageRead = 'MESSAGE_READ',
    MessageReceived = 'MESSAGE_RECEIVED',
    UserRegistered = 'USER_REGISTERED',
    UserLoggedIn = 'USER_LOGGED_IN',
    UserRemoved = 'USER_REMOVED',
    FriendAdded = 'FRIEND_ADDED',
    FriendRemoved = 'FRIEND_REMOVED'
}

export const PUB_SUB = new PubSub()