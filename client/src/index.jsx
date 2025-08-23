import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App'
import { Auth0Provider } from '@auth0/auth0-react';
import "./Page.css"
import { Provider } from 'react-redux'
import Store from "./Store/Store"
import { apiLink } from './utils/utils';
const root = ReactDOM.createRoot(document.getElementById("root"))
// eslint-disable-next-line
root.render(
    <Provider store={Store}>
        <Auth0Provider
            domain="dev-ded546byn38rqmon.us.auth0.com"
            clientId="7wrG0ToFwdGrYIsqUlEcCRMMCxt0tdgJ"
            authorizationParams={{
                redirect_uri: window.location.origin
            }}
        >
            <App />

        </Auth0Provider>
    </Provider>
)