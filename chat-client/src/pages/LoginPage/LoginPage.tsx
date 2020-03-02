import React, { FunctionComponent, useState, ChangeEvent, Fragment } from 'react'
import './LoginPage.css'
import ProfileEdit from '../../components/ProfileEdit'
import LoginPanel from '../../components/LoginPanel'
import { gql } from 'apollo-boost'
import { useMutation, useQuery, useLazyQuery, useApolloClient } from '@apollo/react-hooks'
import { match } from 'react-router-dom'

type LoginPageProps = {
    match: match<any>,
    onUserLogin: (user: any, authToken: string) => void
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

const LOGIN_QUERY = gql`
    query login($email: String!, $password: String!){
        login(email: $email, password: $password) {
            token,
            user {
                id
            }
        }
    }
`

const REGISTER_MUTATION = gql`
    mutation registerUser($user: UserRegisterInput) {
        registerUser(user: $user) {
            id
            username
            firstName
            lastName
            email
        }
    }
`

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

    const [registerUser, registerData] = useMutation(REGISTER_MUTATION)
    const [loginUser, loginData] = useLazyQuery(LOGIN_QUERY, { 
        onCompleted: (data) => {
            props.onUserLogin(data?.login?.user, data?.login?.token)
        }
    })
    
    const error = registerData.error || loginData.error
    const loading = registerData.loading || loginData.loading


    const onLogin = () => {
        loginUser({
            variables: {
                email: state.email,
                password: state.password
            }
        })
    }

    const onRegister = async () => {
        const registerdUser = await registerUser({
            variables: {
                user: {
                    username: state.username,
                    email: state.email,
                    password: state.password,
                    firstName: state.firstName,
                    lastName: state.lastName,
                    birthday: state.birthday
                }
            }
        })

        if(registerdUser) {
            // switch to the login tab, so that the user can log-in
            setState({
                ...state,
                username: '',
                firstName: '',
                lastName: '',
                birthday: '',
                showRegisterTab: false
            })
        }
        
    }

    const setShowRegisterTab = (showRegister: boolean) => {
        setState({
            ...state,
            showRegisterTab: showRegister
        })
    }

    const onPropChange = (propName: string, propVal: any) => {
        setState({
            ...state,
            [propName]: propVal
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
                    { !error && !loading ? (
                        <Fragment>
                            <h3>Welcome to the best Chat App!</h3>
                            <div className='login-tab-title'>
                                <div className={state.showRegisterTab ? '' : 'active'} onClick={() => setShowRegisterTab(false)}>Login</div>
                                <div className={state.showRegisterTab ? 'active' : ''} onClick={() => setShowRegisterTab(true)}>Register</div>
                            </div>
                        </Fragment>
                    ) : error 
                        ? <div>Error :(</div> 
                        : <div>Loading...</div>}
                    
                    { tabContent }
                </div>
            </div>

        </Fragment>
    )
}

export default LoginPage