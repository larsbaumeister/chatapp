import React, {FunctionComponent} from 'react'
import { Link } from 'react-router-dom'
import TextInput from '../TextInput/TextInput'
import './ChatBottomBar.css'

type ChatBottomBarProps = {
    
}

const ChatBottomBar: FunctionComponent<ChatBottomBarProps> = (props) => {

    return (
        <div className='chat-bottom-bar'>
            <TextInput />
            <button>Send</button>
        </div>
    )
}

export default ChatBottomBar