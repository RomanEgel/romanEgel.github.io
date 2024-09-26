import React from 'react'
import ReactDOM from 'react-dom/client'
import { Global } from '@emotion/react'
import App from './App.tsx'
import './index.css'

import WebApp from '@twa-dev/sdk'
import { ThemeParams } from '@twa-dev/types';
import { validateAuthorization, sendThemeParams } from './apiService';
import { AuthProvider } from './AuthContext';
import { createAppStyles } from './AppStyles';

let initDataRawToUse: string;
let themeParams: ThemeParams;

if (import.meta.env.MODE === 'development') {
  initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22AI%20Knowledge%20Base%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ai_kbase_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8152347450021945498&chat_type=supergroup&start_param=-1002434020920&auth_date=1727102388&hash=5930aa55ebb2c4ae56bf39b3bf39d15d423010aaef46cfc43115e45bb6936b46';
  themeParams = {'bg_color': '#18222d', 'text_color': '#ffffff', 'button_color': '#2ea6ff', 'button_text_color': '#ffffff', 'hint_color': '#b1c3d5', 'link_color': '#62bcf9', 'secondary_bg_color': '#131415', 'subtitle_text_color': '#b1c3d5', 'accent_text_color': '#2ea6ff', 'destructive_text_color': '#ef5b5b', 'header_bg_color': '#131415', 'bottom_bar_bg_color': '#18222d', 'section_bg_color': '#18222d', 'section_header_text_color': '#b1c3d5', 'section_separator_color': '#232e3c'};
} else {
  initDataRawToUse = WebApp.initData;
  themeParams = WebApp.themeParams;

  // Send theme parameters to the backend
  sendThemeParams(themeParams)
    .then(() => console.log('Theme parameters sent to backend'))
    .catch(error => console.error('Error sending theme parameters:', error));
}

if (!initDataRawToUse || !initDataRawToUse.includes('start_param')) {
  WebApp.showAlert('It seems the app was launched not from community group. Exiting...');
  WebApp.close();
} else {
  const authorizationValue = initDataRawToUse;

  validateAuthorization(authorizationValue)
    .then(data => {
      if (data.valid) {
        console.log('Validation successful');
        WebApp.ready();

        ReactDOM.createRoot(document.getElementById('root')!).render(
          <React.StrictMode>
            <Global styles={createAppStyles(themeParams)} />
            <AuthProvider authorization={authorizationValue}>
              <App community={data.community} user={data.user} />
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
      WebApp.showAlert('Failed to validate. Please try again later.');
      WebApp.close();
    });
}

