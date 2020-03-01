import React, { FunctionComponent, Fragment, ChangeEvent } from 'react'

type TextInputProps = {
    label?: string,
    value?: string,
    name?: string,
    type?: string,
    onChange?: (val: ChangeEvent<HTMLInputElement>) => void
}

const TextInput: FunctionComponent<TextInputProps> = (props: TextInputProps) => {
    return (
        <Fragment>
            <div><label>{props.label}</label></div>
            <div><input name={props.name} type={props.type ? props.type : 'text'} value={props.value} onChange={props.onChange }></input></div>
        </Fragment>
    )
}

export default TextInput