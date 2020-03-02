import React, {FunctionComponent} from 'react'
import { Link } from 'react-router-dom'

type ChatListProps = {
    chats: any
}

const ChatList: FunctionComponent<ChatListProps> = (props) => {

    
    return (
        <div className='chat-list'>
            <ul>
                { props.chats?.map((chat: any, idx: number) => (
                    <li key={idx}>
                        <Link to={`/chat/${chat.otherUser.id}`}>{ `${chat.otherUser.firstName} ${chat.otherUser.lastName}`}</Link>
                    </li>
                )) }
            </ul>
        </div>
    )
}

export default ChatList