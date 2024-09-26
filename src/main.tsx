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
  initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22AI%20Knowledge%20Base%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ai_kbase_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=2062564855186122266&chat_type=supergroup&start_param=-1002463327873&auth_date=1727359726&hash=64d9f27cd5971131da1132538c34d59e756177405f5be047bc27bf3753cbd781';
  themeParams = {'button_color': '#2481cc', 'secondary_bg_color': '#efeff3', 'section_bg_color': '#ffffff', 'text_color': '#000000', 'link_color': '#2481cc', 'bottom_bar_bg_color': '#e4e4e4', 'accent_text_color': '#2481cc', 'header_bg_color': '#efeff3', 'button_text_color': '#ffffff', 'section_header_text_color': '#6d6d71', 'subtitle_text_color': '#999999', 'bg_color': '#ffffff', 'destructive_text_color': '#ff3b30', 'hint_color': '#999999', 'section_separator_color': '#232e3c'};
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

