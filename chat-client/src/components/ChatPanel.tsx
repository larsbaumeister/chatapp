import React, {FunctionComponent, Fragment, useState, createRef, RefObject} from 'react'
import MessageBubble from './MessageBubble/MessageBubble'
import ChatBottomBar from './ChatBottomBar/ChatBottomBar'
import { BaseEmoji } from 'emoji-mart'

type ChatPanelProps = {
    chats: any,
    onMessageSend: (text: string, receiverId: number) => void
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
        
        const chatPartnerId = Number((this.props as any).match.params.userId)
        const chat = this.props.chats?.find((c: any) => c.otherUser.id === chatPartnerId)

        const onTextChange = (text: string) => {
            this.setState({
                ...this.state,
                typedTexts: {
                    ...this.state.typedTexts,
                    [chatPartnerId]: text
                },
                emojiPickerOpen: { ...this.state.emojiPickerOpen }
            })
        }

        const onMessageSend = () => {
            this.props.onMessageSend(this.state.typedTexts[chatPartnerId], chatPartnerId)
            this.setState({
                ...this.state,
                typedTexts: { 
                    ...this.state.typedTexts,
                    [chatPartnerId]: ''
                },
                emojiPickerOpen: { ...this.state.emojiPickerOpen }
            })
        }
    
        const onEmojiSelected = (emoji: BaseEmoji) => {
            this.setState({
                ...this.state,
                typedTexts: {
                    ...this.state.typedTexts,
                    [chatPartnerId]: (this.state.typedTexts[chatPartnerId] || '') + emoji.native
                },
                emojiPickerOpen: {
                    ...this.state.emojiPickerOpen,
                    [chatPartnerId]: false
                }
            })
        }
    
        const onEmojiButtonClicked = () => {
            this.setState({
                ...this.state,
                typedTexts: { ...this.state.typedTexts },
                emojiPickerOpen: { 
                    ...this.state.emojiPickerOpen,
                    [chatPartnerId]: !(this.state.emojiPickerOpen[chatPartnerId] || false)
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
                    text={ this.state.typedTexts[chatPartnerId] || '' } 
                    onTextChange={ onTextChange } 
                    onMessageSend={ onMessageSend } 
                    onEmojiButtonClicked={onEmojiButtonClicked}
                    onEmojiSelected={onEmojiSelected}
                    emojiPickedOpen={ this.state.emojiPickerOpen[chatPartnerId] || false } />  
            </Fragment>
            
        )
    }

}

export default ChatPanel