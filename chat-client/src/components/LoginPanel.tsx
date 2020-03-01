import React, {FunctionComponent, Fragment, ChangeEvent} from 'react'
import './LoginPanel.css'

type LoginPanelProps = {
    username: string,
    password: string,
    onLogin: () => void,
    onPropChange: (propName: string, propValue: any) => void,
}

const LoginPanel: FunctionComponent<LoginPanelProps> = (props) => {

    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        props.onPropChange(evt.target.name, evt.target.value)
    }

    return (
        <Fragment>
            <div><label>Username</label></div>
            <div><input type='text' name='username' value={props.username} onChange={onChange}></input></div>
            <div><label>Password</label></div>
            <div><input type='password' name='password' value={props.password} onChange={onChange}></input></div>
            <div className='login-button-wrapper'><button onClick={props.onLogin}>Login</button></div>
        </Fragment> 
    )

}
export default LoginPanel