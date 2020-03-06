import React, { Fragment, FunctionComponent, useState } from 'react'

import ProfilePage from './pages/ProfilePage';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LoginPage from './pages/LoginPage/LoginPage';
import ChatPage from './pages/ChatPage/ChatPage';
import Cookies from 'universal-cookie';

type AppState = {
    user: any
}

export const getAuthTokenFromCookie = () => {
    const cookies = new Cookies()
    if(cookies.get('user')){
        const jsonString = decodeURIComponent(cookies.get('user'))
        return [cookies.get('auth'), JSON.parse(jsonString)]
    }
        
    else
        return [null, null]
}

const writeAuthTokenToCookie = (token: string, user: any) => {
    const cookies = new Cookies()
    cookies.set('auth', token)
    cookies.set('user', encodeURIComponent(JSON.stringify(user)))
}

const removeAuthToken = () => {
    const cookies = new Cookies()
    cookies.remove('auth')
    cookies.remove('user')
}

const App: FunctionComponent<{}> = () => {

    const [state, setState] = useState<AppState>({ user: null })

    const onUserLogin = (user: any, token: string) => {
        setState({
            ...state,
            user: user
         })
         writeAuthTokenToCookie(token, user)
    }

    const [authToken, user] = getAuthTokenFromCookie()

    return (
        <Router>
            { authToken 
                ?   <Fragment>
                        <Route path='/user/:userId' component={ProfilePage} />
                        <Route path='/chat/:otherUserId' render={ props => <ChatPage {...props} userId={user.id} /> } />
                    </Fragment>
                : null}
            
            { authToken
                ? (<Route exact path='/' render={ props => <ChatPage {...props} userId={user.id} /> } />) 
                : (<Route exact path='/' render={ props => <LoginPage {...props} onUserLogin={onUserLogin} /> } />) }
        </Router>
    )
}
export default App
