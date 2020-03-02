import React, { FunctionComponent, Fragment, ChangeEvent } from 'react'
import './TextInput.css'

type TextInputProps = {
    label?: string,
    value?: string,
    name?: string,
    type?: string,
    onChange?: (val: ChangeEvent<HTMLInputElement>) => void
}

const TextInput: FunctionComponent<TextInputProps> = (props: TextInputProps) => {
    return (
        <div className='textinput'>
            <label>{props.label}</label>
            <input name={props.name} type={props.type} value={props.value} onChange={props.onChange }></input>
        </div>
    )
}

TextInput.defaultProps = {
    type: 'text'
}

export default TextInput