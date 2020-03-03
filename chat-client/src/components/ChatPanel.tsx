import React, {FunctionComponent} from 'react'
import MessageBubble from './MessageBubble'

type ChatPanelProps = {
    chats: any
}

const ChatPanel: FunctionComponent<ChatPanelProps> = (props: any) => {

    const chat = props.chats?.find((c: any) => c.otherUser.id === Number(props.match.params.userId))

    return (
        <div className='chat-panel'>
            { chat.messages.map((m: any) => <MessageBubble message={m} />) }
        </div>
    )
}

export default ChatPanel