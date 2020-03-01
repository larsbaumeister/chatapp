import React, { FunctionComponent, useState, ChangeEvent } from 'react'
import './LoginPage.css'


type LoginPageProps = {

}

type LoginPageState = {
    username: string,
    password: string
}

const LoginPage: FunctionComponent<LoginPageProps> = (props) => {
    const [state, setState] = useState<LoginPageState>({
        password: '',
        username: ''
    })
    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [evt.target.name]: evt.target.value
        })
    }

    return (
        <div className='login-page'>
            <div className='login-card'>
                <div className='login-form-wrapper'>
                    <h2>Welcome to the best Chat App!</h2>
                    <h4>Sign in</h4>
                    <div><label>Username</label></div>
                    <div><input type='text' name='username' value={state.username} onChange={onChange}></input></div>
                    <div><label>Password</label></div>
                    <div><input type='password' name='password' value={state.password} onChange={onChange}></input></div>
                    <button>Login</button>
                </div>
            </div>
        </div>
        
    )
}

export default LoginPage