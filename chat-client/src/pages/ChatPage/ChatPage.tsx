import React, { FunctionComponent, useState, useEffect } from 'react'
import ChatList from '../../components/ChatList'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import ChatPanel from '../../components/ChatPanel'
import './ChatPage.css'
import { Route } from 'react-router-dom'
import ChatBottomBar from '../../components/ChatBottomBar/ChatBottomBar'
import { valueToObjectRepresentation } from 'apollo-utilities'

type ChatPageProps = {
    userId: number
}

type ChatPageState = {

}

const CHAT_PAGE_QUERY = gql`
query($userId: Int!) {
    users(id: $userId) {
        chats {
            otherUser {
                id
                username
                firstName
                lastName
            }
            messages {
                id
                content
                sender { 
                    id
                    username
                    firstName
                    lastName
                 }
                receiver {
                    id
                    username
                    firstName
                    lastName
                }
                sendDate
            }
        }
    }
}
`

const MESSAGE_SEND_SUBSCRIPTION = gql`
    subscription($receiverId: Int!) {
        messageSend(receiverId: $receiverId) {
            id
            content
            sender {
                id
                username
                firstName
                lastName
            }
            receiver {
                id
                username
                firstName
                lastName
            }
            sendDate
        }
    }
`

const ChatPage: FunctionComponent<ChatPageProps> = (props) => {

    const { data, loading, error, subscribeToMore } = useQuery(CHAT_PAGE_QUERY, { variables: { userId: props.userId }})

    useEffect(() => {
        const onUnsubscribe =  subscribeToMore({
            document: MESSAGE_SEND_SUBSCRIPTION,
            variables: { receiverId: props.userId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newMessage = subscriptionData.data.messageSend;
                
                // copy all the messages and insert the new message
                const newChats = prev.users?.[0]?.chats.map((c: any) => {
                    const newChat = { 
                        otherUser: { ...c.otherUser },
                        messages: [ ...c.messages?.map((m: any) => {
                            return {
                                ...m,
                                sender: { ...m.sender },
                                receiver: { ...m.receiver }
                            }
                        })]
                    }
                    if (newMessage.sender.id === c.otherUser.id) {
                        newChat.messages.push(newMessage)
                    }
                    return newChat
                })
    
                return { users: [{ chats: newChats }] }
            }
        })

        return () => {
            // the return value of useEffect() is a function that is called whenever the component unmounts
            // we want to unsubscribe here
            onUnsubscribe()
        }
    })
    

    if (loading)
        return <div>Loading...</div>
    
    if (error)
        return <div>Error :(</div>

    return (
        <div className='chat-page'>
            <ChatList chats={data?.users?.[0]?.chats} />

            <Route path='/chat/:userId' render={ props => <ChatPanel {...props} chats={data?.users?.[0]?.chats} />} />
            <Route exact path='/' component={() => <h3>No chat selected...</h3>} />

            <ChatBottomBar />
        </div>
    )
}

export default ChatPage