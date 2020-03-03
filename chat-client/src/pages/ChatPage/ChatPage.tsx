import React, { FunctionComponent, useState } from 'react'
import ChatList from '../../components/ChatList'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import ChatPanel from '../../components/ChatPanel'
import './ChatPage.css'
import { Route } from 'react-router-dom'
import ChatBottomBar from '../../components/ChatBottomBar'

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

const ChatPage: FunctionComponent<ChatPageProps> = (props) => {

    const {data, loading, error} = useQuery(CHAT_PAGE_QUERY, { variables: { userId: props.userId }})

    if (loading)
        return <div>Loading...</div>
    
    if (error)
        return <div>Error :(</div>

    return (
        <div className='chat-page'>
            <ChatList chats={data?.users[0]?.chats} />

            <Route path='/chat/:userId' render={ props => <ChatPanel {...props} chats={data?.users[0]?.chats} />} />
            <Route exact path='/' component={() => <h3>No chat selected...</h3>} />

            <ChatBottomBar />
        </div>
    )
}

export default ChatPage