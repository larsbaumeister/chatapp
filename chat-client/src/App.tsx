import React, { Fragment } from 'react'
import Navbar from './components/Navbar'

import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './connection/GqlClient';
import ProfilePage from './pages/ProfilePage';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LoginPage from './pages/LoginPage/LoginPage';


export default function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Route exact path='/' component={LoginPage} />
                <Route path='/user/:userId' component={ProfilePage} />
            </Router>
        </ApolloProvider>
    )
}
