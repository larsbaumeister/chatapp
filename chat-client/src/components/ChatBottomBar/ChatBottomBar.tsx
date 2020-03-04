import React, {FunctionComponent} from 'react'
import { Link } from 'react-router-dom'
import TextInput from '../TextInput/TextInput'
import './ChatBottomBar.css'

type ChatBottomBarProps = {
    text: string,
    onTextChange: (text: string) => void
    onMessageSend: () => void
}

const ChatBottomBar: FunctionComponent<ChatBottomBarProps> = (props) => {

    return (
        <div className='chat-bottom-bar'>
            <TextInput value={props.text} onChange={ evt => props.onTextChange(evt.target.value) } />
            <button onClick={props.onMessageSend}>Send</button>
        </div>
    )
}

export default ChatBottomBar