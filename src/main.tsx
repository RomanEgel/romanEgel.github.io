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
      WebApp.ready();

      ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      )
    } else {
      console.error('Validation failed');
      WebApp.showAlert('Failed to validate. Please try again later.');
      WebApp.close();
    }
  })
  .catch(error => {
    console.error('Error during validation:', error);
    // Handle any errors that occurred during the fetch
    WebApp.showAlert('Failed to validate. Please try again later.');
    WebApp.close();
  });

