import React, {FunctionComponent} from 'react'
import { Link } from 'react-router-dom'
import './MessageBubble.css'

type MessageBubbleProps = {
    message: any
}

const MessageBubble: FunctionComponent<MessageBubbleProps> = ({ message }) => {

    return (
        <div className='message-bubble'>
            <div className='header'>
                <div className='username'>{`${message.sender.firstName} ${message.sender.lastName}`}</div>
                <div className='sendDate'>{message.sendDate}</div>
            </div>
            <div className='content'>{message.content}</div>
        </div>
    )
}

export default MessageBubble