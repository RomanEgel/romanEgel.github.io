import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global } from '@emotion/react';
import App from './App.tsx';
import SetupApp from './SetupApp';
import SetupAppRequired from './SetupAppRequired.tsx'; // Add this line
import './index.css';

import WebApp from '@twa-dev/sdk';
import { ThemeParams } from '@twa-dev/types';
import { validateAuthorization, sendThemeParams } from './apiService';
import { AuthProvider } from './AuthContext';
import { createAppStyles } from './AppStyles';

let initDataRawToUse: string;
let themeParams: ThemeParams;

if (import.meta.env.MODE === 'development') {
  initDataRawToUse = 'user=%7B%22id%22%3A219691432%2C%22first_name%22%3A%22Roman%22%2C%22last_name%22%3A%22Egel%22%2C%22username%22%3A%22romanEgel%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8152347450021945498&chat_type=supergroup&start_param=383cff75-c9ae-4bb2-89ff-f212f7bcb8ec&auth_date=1727523386&hash=0ec98444d3d39e6b110e65994e3ed19acb8b22561986454b996a3e8994b4d7e5';
  themeParams = {'bg_color': '#1e1e1e', 'section_bg_color': '#181819', 'secondary_bg_color': '#000000', 'text_color': '#ffffff', 'hint_color': '#7d7d7d', 'link_color': '#57a7e0', 'button_color': '#50a8eb', 'button_text_color': '#ffffff', 'header_bg_color': '#232326', 'accent_text_color': '#64b5ef', 'section_header_text_color': '#6cb6f8', 'subtitle_text_color': '#7e7e7f', 'destructive_text_color': '#ee686f', 'section_separator_color': '#000000', 'bottom_bar_bg_color': '#000000'};
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

        const Main = () => {
          const handleSetupComplete = () => {
            // Reload the entire page
            window.location.reload();
          };

          return (
            data.ready ? (
              <App community={data.community} user={data.user} />
            ) : (
              ( data.admin ?
                (<SetupApp 
                  onSetupComplete={handleSetupComplete} 
                  community={data.community}
                />)
                : (
                  <SetupAppRequired community={data.community} />
                )
              )
            )
          );
        };

        ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
          <React.StrictMode>
            <Global styles={createAppStyles(themeParams)} />
            <AuthProvider authorization={authorizationValue}>
              <Main />
            </AuthProvider>
          </React.StrictMode>
        );
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

