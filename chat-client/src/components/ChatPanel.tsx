import React, {FunctionComponent, Fragment, useState} from 'react'
import MessageBubble from './MessageBubble/MessageBubble'
import ChatBottomBar from './ChatBottomBar/ChatBottomBar'
import { EmojiData, BaseEmoji } from 'emoji-mart'

type ChatPanelProps = {
    chats: any,
    onMessageSend: (text: string, receiverId: number) => void
}

type ChatPanelState = {
    typedTexts: any,
    emojiPickerOpen: any,

}


const ChatPanel: FunctionComponent<ChatPanelProps> = (props: any) => {
    const [state, setState] = useState<ChatPanelState>({
        typedTexts: {},
        emojiPickerOpen: {}
    })

    const chatPartnerId = Number(props.match.params.userId)
    const chat = props.chats?.find((c: any) => c.otherUser.id === chatPartnerId)

    const onTextChange = (text: string) => {
        setState({
            ...state,
            typedTexts: {
                ...state.typedTexts,
                [chatPartnerId]: text
            },
            emojiPickerOpen: { ...state.emojiPickerOpen }
        })
    }

    const onMessageSend = () => {
        props.onMessageSend(state.typedTexts[chatPartnerId], chatPartnerId)
        setState({
            ...state,
            typedTexts: { 
                ...state.typedTexts,
                [chatPartnerId]: ''
            },
            emojiPickerOpen: { ...state.emojiPickerOpen }
        })
    }

    const onEmojiSelected = (emoji: BaseEmoji) => {
        setState({
            ...state,
            typedTexts: {
                ...state.typedTexts,
                [chatPartnerId]: state.typedTexts[chatPartnerId] + emoji.native
            },
            emojiPickerOpen: {
                ...state.emojiPickerOpen,
                [chatPartnerId]: false
            }
        })
    }

    const onEmojiButtonClicked = () => {
        setState({
            ...state,
            typedTexts: { ...state.typedTexts },
            emojiPickerOpen: { 
                ...state.emojiPickerOpen,
                [chatPartnerId]: !(state.emojiPickerOpen[chatPartnerId] || false)
            },
        })
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

            <ChatBottomBar 
                text={ state.typedTexts[chatPartnerId] || '' } 
                onTextChange={ onTextChange } 
                onMessageSend={ onMessageSend } 
                onEmojiButtonClicked={onEmojiButtonClicked}
                onEmojiSelected={onEmojiSelected}
                emojiPickedOpen={state.emojiPickerOpen[chatPartnerId] || false} />  
        </Fragment>
        
    )
}

export default ChatPanel