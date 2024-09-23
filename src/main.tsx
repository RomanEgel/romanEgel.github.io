import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import WebApp from '@twa-dev/sdk'
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { validateAuthorization } from './apiService'; // Import the service function
import { AuthProvider } from './AuthContext'; // Import the AuthProvider

let initDataRawToUse;

if (import.meta.env.MODE === 'development') {
  // Mock init data for testing purposes
  initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22AI%20Knowledge%20Base%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ai_kbase_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8152347450021945498&chat_type=supergroup&start_param=-1002434020920&auth_date=1727102388&hash=5930aa55ebb2c4ae56bf39b3bf39d15d423010aaef46cfc43115e45bb6936b46';
} else {
  const { initDataRaw } = retrieveLaunchParams();
  initDataRawToUse = initDataRaw;
}
if (!initDataRawToUse || !initDataRawToUse.includes('start_param')) {
  WebApp.showAlert('It seems the app was launched not from community group. Exiting...');
  WebApp.close();
} else {
  const authorizationValue = initDataRawToUse; // Replace with the actual authorization value

  validateAuthorization(authorizationValue)
    .then(data => {
      if (data.valid) {
        console.log('Validation successful');
        WebApp.ready();

        ReactDOM.createRoot(document.getElementById('root')!).render(
          <React.StrictMode>
            <AuthProvider authorization={authorizationValue}>
              <App community={data.community} />
            </AuthProvider>
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
}

