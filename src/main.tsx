import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import WebApp from '@twa-dev/sdk'
import { retrieveLaunchParams } from '@telegram-apps/sdk';


const { initDataRaw } = retrieveLaunchParams();

fetch('https://telegram-bot-131843337439.europe-west3.run.app/oauth/validate', {
  method: 'POST',
  headers: {
    Authorization: `tma ${initDataRaw}`
  },
})
  .then(response => response.json())
  .then(data => {
    if (data.valid) {
      console.log('Validation successful');
      // Proceed with the app initialization
    } else {
      console.error('Validation failed');
      // Handle the case when validation fails
    }
  })
  .catch(error => {
    console.error('Error during validation:', error);
    // Handle any errors that occurred during the fetch
  });


WebApp.ready();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
