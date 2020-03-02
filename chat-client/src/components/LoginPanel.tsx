import React, {FunctionComponent, Fragment, ChangeEvent} from 'react'
import './LoginPanel.css'
import TextInput from './TextInput'

type LoginPanelProps = {
    email: string,
    password: string,
    onLogin: () => void,
    onPropChange: (propName: string, propValue: any) => void,
}

const LoginPanel: FunctionComponent<LoginPanelProps> = (props) => {

    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault()
        props.onPropChange(evt.target.name, evt.target.value)
    }

    return (
        <Fragment>
            <TextInput label='EMail' name='email' value={props.email} onChange={onChange} />
            <TextInput label='Password' name='password' value={props.password} onChange={onChange} type='password' />
            <div className='login-button-wrapper'><button onClick={props.onLogin}>Login</button></div>
        </Fragment> 
    )

}
export default LoginPanel