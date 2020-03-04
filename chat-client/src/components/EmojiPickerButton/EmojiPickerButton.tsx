import React, { FunctionComponent, Fragment } from 'react'
import { Picker, EmojiData, BaseEmoji } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import './EmojiPickerButton.css'

type NavbarProps = {
    isOpen: boolean,
    onClick: () => void,
    onSelect: (data: BaseEmoji) => void
}

const EmojiPickerButton: FunctionComponent<NavbarProps> = ({ isOpen, onClick, onSelect }) => {
    return (
        <div className='emoji-picker-button'>
            <div className={'emoji-picker-overlay ' + (isOpen ? 'active': 'inactive')}>
                <Picker onSelect={onSelect} title='Pick your emoji' set='twitter' />
            </div>
            <button className='my-button' onClick={onClick}>☝️</button>
        </div>
    )
}
export default EmojiPickerButton