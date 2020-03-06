import React, {FunctionComponent, Fragment, useState, createRef, RefObject} from 'react'
import MessageBubble from './MessageBubble/MessageBubble'
import ChatBottomBar from './ChatBottomBar/ChatBottomBar'
import { BaseEmoji } from 'emoji-mart'

type ChatPanelProps = {
    chats: any,
    onMessageSend: (text: string, receiverId: number) => void,
    otherUserId: number
}

type ChatPanelState = {
    typedTexts: any,
    emojiPickerOpen: any
}


class ChatPanel extends React.Component<ChatPanelProps, ChatPanelState> {

    panelRef: RefObject<HTMLDivElement>

    constructor(props: ChatPanelProps) {
        super(props)
        this.panelRef = createRef<HTMLDivElement>()
        this.state = {
            typedTexts: {},
            emojiPickerOpen: {}
        }
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        if(this.panelRef.current)
            this.panelRef.current.scrollTop = this.panelRef.current.scrollHeight
    }

    render() {
        const chat = this.props.chats?.find((c: any) => c.otherUser.id === this.props.otherUserId)

        const onTextChange = (text: string) => {
            this.setState({
                ...this.state,
                typedTexts: {
                    ...this.state.typedTexts,
                    [this.props.otherUserId]: text
                },
                emojiPickerOpen: { ...this.state.emojiPickerOpen }
            })
        }

        const onMessageSend = () => {
            this.props.onMessageSend(this.state.typedTexts[this.props.otherUserId], this.props.otherUserId)
            this.setState({
                ...this.state,
                typedTexts: { 
                    ...this.state.typedTexts,
                    [this.props.otherUserId]: ''
                },
                emojiPickerOpen: { ...this.state.emojiPickerOpen }
            })
        }
    
        const onEmojiSelected = (emoji: BaseEmoji) => {
            this.setState({
                ...this.state,
                typedTexts: {
                    ...this.state.typedTexts,
                    [this.props.otherUserId]: (this.state.typedTexts[this.props.otherUserId] || '') + emoji.native
                },
                emojiPickerOpen: {
                    ...this.state.emojiPickerOpen,
                    [this.props.otherUserId]: false
                }
            })
        }
    
        const onEmojiButtonClicked = () => {
            this.setState({
                ...this.state,
                typedTexts: { ...this.state.typedTexts },
                emojiPickerOpen: { 
                    ...this.state.emojiPickerOpen,
                    [this.props.otherUserId]: !(this.state.emojiPickerOpen[this.props.otherUserId] || false)
                },
            })
        }
    
        return (
            <Fragment>
                <div ref={this.panelRef} className='chat-panel'>
                    { 
                        chat 
                        ? chat.messages.map((m: any) => <MessageBubble key={m.id} message={m} />)
                        : <div>Invalid Chat!</div> 
                    }
                </div>
    
                <ChatBottomBar 
                    text={ this.state.typedTexts[this.props.otherUserId] || '' } 
                    onTextChange={ onTextChange } 
                    onMessageSend={ onMessageSend } 
                    onEmojiButtonClicked={onEmojiButtonClicked}
                    onEmojiSelected={onEmojiSelected}
                    emojiPickedOpen={ this.state.emojiPickerOpen[this.props.otherUserId] || false } />  
            </Fragment>
            
        )
    }

}

export default ChatPanel