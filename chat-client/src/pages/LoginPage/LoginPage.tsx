import React, { FunctionComponent, useState, ChangeEvent, Fragment } from 'react'
import './LoginPage.css'
import ProfileEdit from '../../components/ProfileEdit'
import LoginPanel from '../../components/LoginPanel'

type LoginPageProps = {

}

type LoginPageState = {
    showRegisterTab: boolean,
    
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    birthday: string
}

const LoginPage: FunctionComponent<LoginPageProps> = (props) => {
    const [state, setState] = useState<LoginPageState>({
        showRegisterTab: false,
        password: '',
        username: '',
        birthday: '',
        email: '',
        firstName: '',
        lastName: ''
    })

    const onPropChange = (propName: string, propVal: any) => {
        setState({
            ...state,
            [propName]: propVal
        })
    }

    const onLogin = () => {

    }

    const onRegister = () => {

    }

    const setShowRegisterTab = (showRegister: boolean) => {
        setState({
            ...state,
            showRegisterTab: showRegister
        })
    }

    let tabContent
    if (state.showRegisterTab)
        tabContent = <ProfileEdit {...state} onPropChange={onPropChange} onSave={onRegister} saveButtonText='Register' />
    else
        tabContent = <LoginPanel {...state} onPropChange={onPropChange} onLogin={onLogin} />

    return (
        <Fragment>

            <div className='login-background'>
                <video autoPlay muted loop id=''>
                    <source src="background.mp4" type="video/mp4"></source>
                </video>
            </div>
            

            <div className='login-page'>
                <div className='login-card'>
                    <h3>Welcome to the best Chat App!</h3>
                    <div className='login-tab-title'>
                        <div className={state.showRegisterTab ? '' : 'active'} onClick={() => setShowRegisterTab(false)}>Login</div>
                        <div className={state.showRegisterTab ? 'active' : ''} onClick={() => setShowRegisterTab(true)}>Register</div>
                    </div>
                    { tabContent }
                </div>
            </div>

        </Fragment>
    )
}

export default LoginPage