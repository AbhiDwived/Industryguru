import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import "./Page.css"
import { Provider } from 'react-redux'
import Store from "./Store/Store"
import { measureWebVitals, preloadCriticalResources } from './utils/performance';

// Preload critical resources
preloadCriticalResources();

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW registered'))
      .catch(() => console.log('SW registration failed'));
  });
}

// Measure performance
if (process.env.NODE_ENV === 'development') {
  measureWebVitals();
}

const root = ReactDOM.createRoot(document.getElementById("root"))
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