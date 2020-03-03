import React, {FunctionComponent} from 'react'
import { Link } from 'react-router-dom'

type ChatListProps = {
    chats: any
}

const ChatList: FunctionComponent<ChatListProps> = (props) => {

    return (
        <div className='chat-list'>

            { props.chats?.map((chat: any) => (
                <Link key={chat.otherUser.id} to={`/chat/${chat.otherUser.id}`}>
                    <div className='chat-list-card'>
                        <div className='user-name'>{ `${chat.otherUser.firstName} ${chat.otherUser.lastName}`}</div>
                        <div className='last-message'>{ chat.messages?.[0]?.content || 'No messages' }</div>
                    </div>
                </Link>
            )) }
        </div>
    )
}

export default ChatList