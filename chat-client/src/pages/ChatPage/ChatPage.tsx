import React, { FunctionComponent, useEffect } from 'react'
import ChatList from '../../components/ChatList'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import ChatPanel from '../../components/ChatPanel'
import './ChatPage.css'
import { Route } from 'react-router-dom'


type ChatPageProps = {
    userId: number
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

const SEND_MESSAGE_MUTATION = gql`
    mutation sendMessage($msg: SendMessageInput!) {
        sendMessage(message: $msg){
            id
        }
    }
`

const MESSAGE_SEND_SUBSCRIPTION = gql`
    subscription {
        messageSend {
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
    const [ sendMessage ] = useMutation(SEND_MESSAGE_MUTATION)


    const otherUserId = Number((props as any).match.params.otherUserId)

    useEffect(() => {
        // subscribe for new messages
        const onUnsubscribe =  subscribeToMore({
            document: MESSAGE_SEND_SUBSCRIPTION,
            onError: err => { 
                console.error(err)
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data)
                    return prev;
                
                const newMessage = subscriptionData.data.messageSend;
                console.log('Received new message: ', newMessage)
                
                // copy all the messages and insert the new message
                const newChats = prev.users?.[0]?.chats.map((c: any) => {
                    const newChat = { 
                        ...c,
                        otherUser: { ...c.otherUser },
                        messages: [ ...c.messages?.map((m: any) => {
                            return {
                                ...m,
                                sender: { ...m.sender },
                                receiver: { ...m.receiver }
                            }
                        })]
                    }
                    if (newMessage.sender.id === c.otherUser.id || newMessage.receiver.id === c.otherUser.id) {
                        newChat.messages.push(newMessage)
                    }
                    return newChat
                })
    
                return { users: [{
                        ...prev.users?.[0],
                        chats: newChats
                    }] }
            }
        })

        return () => {
            // the return value of useEffect() is a function that is called whenever the component unmounts
            // we want to unsubscribe here
            onUnsubscribe()
        }
    })

    const onMessageSend = (text: string, receiverId: number) => {
        sendMessage({
            variables: { 
                msg: {
                    senderId: props.userId,
                    receiverId: receiverId,
                    content: text
                }
            }
        })
    }

    if (loading)
        return <div>Loading...</div>
    
    if (error)
        return <div>Error :(</div>

    return (
        <div className='chat-page'>
            <ChatList 
                    chats={data?.users?.[0]?.chats} 
                    otherUserId={otherUserId} 
            />

            <ChatPanel {...props} 
                    chats={data?.users?.[0]?.chats}
                    onMessageSend={onMessageSend}
                    otherUserId={otherUserId}
            />

        </div>
    )
}

export default ChatPage