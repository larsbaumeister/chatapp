import React, {FunctionComponent, Fragment, KeyboardEvent} from 'react'
import { Link } from 'react-router-dom'
import TextInput from '../TextInput/TextInput'


import './ChatBottomBar.css'
import EmojiPickerButton from '../EmojiPickerButton/EmojiPickerButton'
import { BaseEmoji } from 'emoji-mart'

type ChatBottomBarProps = {
    text: string,
    onTextChange: (text: string) => void,
    onMessageSend: () => void,
    onEmojiButtonClicked: () => void,
    onEmojiSelected: (emoji: BaseEmoji) => void,
    emojiPickedOpen: boolean
}

const ChatBottomBar: FunctionComponent<ChatBottomBarProps> = (props) => {

    const handleKeyEvent = (evt: KeyboardEvent<HTMLDivElement>) => {
        if(evt.key === 'Enter') {
            props.onMessageSend()
        }
    }

    return (
        <div className='chat-bottom-bar'>
            <EmojiPickerButton 
                isOpen={props.emojiPickedOpen} 
                onClick={props.onEmojiButtonClicked} 
                onSelect={props.onEmojiSelected} 
            />
            <TextInput value={props.text} onChange={ evt => props.onTextChange(evt.target.value) } onKeyPress={handleKeyEvent}  />
            <button className='my-button' onClick={props.onMessageSend}>Send</button>
        </div>
    )
}

export default ChatBottomBar