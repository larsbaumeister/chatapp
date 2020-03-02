import React, { FunctionComponent, useState } from 'react'
import ChatList from '../../components/ChatList'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import ChatPanel from '../../components/ChatPanel'
import './ChatPage.css'
import { Route } from 'react-router-dom'

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
                sender {id}
                receiver {id}
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

            <Route path='/chat/:userId' render={ props => <ChatPanel  />} />
            <Route exact path='/' component={() => <h3>No chat selected...</h3>} />
        </div>
    )
}

export default ChatPage