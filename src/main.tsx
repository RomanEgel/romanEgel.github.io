import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import WebApp from '@twa-dev/sdk'
import { retrieveLaunchParams } from '@telegram-apps/sdk';


let initDataRawToUse;

if (import.meta.env.MODE === 'development') {
  // Mock init data for testing purposes
  initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22AI%20Knowledge%20Base%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ai_kbase_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8152347450021945498&chat_type=supergroup&auth_date=1727037071&hash=8360bd450032e1602cf0c810f2cee4fae8460b07920b6a790aedbfd99d52b5bf';
} else {
  const { initDataRaw } = retrieveLaunchParams();
  initDataRawToUse = initDataRaw;
}

fetch('https://telegram-bot-131843337439.europe-west3.run.app/oauth/validate', {
  method: 'POST',
  headers: {
    Authorization: `tma ${initDataRawToUse}`
  },
})
  .then(response => response.json())
  .then(data => {
    if (data.valid) {
      console.log('Validation successful');
      WebApp.ready();

      ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
          <App user={data.user} community={data.community} />
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

