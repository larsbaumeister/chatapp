import React, {FunctionComponent, Fragment, useState} from 'react'
import MessageBubble from './MessageBubble/MessageBubble'
import ChatBottomBar from './ChatBottomBar/ChatBottomBar'

type ChatPanelProps = {
    chats: any,
    onMessageSend: (text: string, receiverId: number) => void
}

type ChatPanelState = {
    typedTexts: any
}


const ChatPanel: FunctionComponent<ChatPanelProps> = (props: any) => {
    const [state, setState] = useState<ChatPanelState>({
        typedTexts: {}
    })

    const chatPartnerId = Number(props.match.params.userId)
    const chat = props.chats?.find((c: any) => c.otherUser.id === chatPartnerId)

    const onTextChange = (text: string) => {
        setState({
            ...state,
            typedTexts: {
                ...state.typedTexts,
                [chatPartnerId]: text
            }
        })
    }

    const onMessageSend = () => {
        props.onMessageSend(state.typedTexts[chatPartnerId], chatPartnerId)
    }

    return (
        <Fragment>
            <div className='chat-panel'>
                { 
                    chat 
                    ? chat.messages.map((m: any) => <MessageBubble key={m.id} message={m} />)
                    : <div>Invalid Chat!</div> 
                }
            </div>

            <ChatBottomBar text={ state.typedTexts[chatPartnerId] || '' } onTextChange={ onTextChange } onMessageSend={ onMessageSend } />  
        </Fragment>
        
    )
}

export default ChatPanel