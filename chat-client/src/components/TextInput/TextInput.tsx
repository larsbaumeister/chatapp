import React, { FunctionComponent, ChangeEvent, KeyboardEvent } from 'react'
import './TextInput.css'

type TextInputProps = {
    label?: string,
    value?: string,
    name?: string,
    type?: string,
    onChange?: (evt: ChangeEvent<HTMLInputElement>) => void,
    onKeyPress?: (evt: KeyboardEvent<HTMLInputElement>) => void
}

const TextInput: FunctionComponent<TextInputProps> = (props: TextInputProps) => {
    return (
        <div className='textinput'>
            {props.label ? <label>{props.label}</label> : null}
            <input name={props.name} type={props.type} value={props.value} onChange={props.onChange } onKeyPress={props.onKeyPress}></input>
        </div>
    )
}

TextInput.defaultProps = {
    type: 'text'
}

export default TextInput