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
import CommunitiesPicker from './CommunitiesPicker.tsx'; // Add this line

let initDataRawToUse: string;
let themeParams: ThemeParams;

if (import.meta.env.MODE === 'development') {
  //initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22AI%20Knowledge%20Base%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ai_kbase_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8299257676485440450&chat_type=sender&start_param=383cff75-c9ae-4bb2-89ff-f212f7bcb8ec&auth_date=1727524457&hash=d3e1805d61e4097b43b4196942a330147939a1ac773c6100a929e5eb5771c72c';
  initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22Locals%20Only%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22locals_only_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8299257676485440450&chat_type=sender&auth_date=1729882697&hash=d9d5617e738cd1caef2d7247e94ac9bdac27bd5b7211bfc57aff99b3704bdfac';
  themeParams = {'bg_color': '#1e1e1e', 'section_bg_color': '#181819', 'secondary_bg_color': '#000000', 'text_color': '#ffffff', 'hint_color': '#7d7d7d', 'link_color': '#57a7e0', 'button_color': '#50a8eb', 'button_text_color': '#ffffff', 'header_bg_color': '#232326', 'accent_text_color': '#64b5ef', 'section_header_text_color': '#6cb6f8', 'subtitle_text_color': '#7e7e7f', 'destructive_text_color': '#ee686f', 'section_separator_color': '#000000', 'bottom_bar_bg_color': '#000000'};
} else {
  initDataRawToUse = WebApp.initData;
  themeParams = WebApp.themeParams;

  // Send theme parameters to the backend
  sendThemeParams(themeParams)
    .then(() => console.log('Theme parameters sent to backend'))
    .catch(error => console.error('Error sending theme parameters:', error));
}

if (!initDataRawToUse) {
  WebApp.showAlert('It seems the app was launched not from telegram. Exiting...', () => WebApp.close());
} else {
  const authorizationValue = initDataRawToUse;

  validateAuthorization(authorizationValue)
    .then(data => {
      if (data.valid) {
        console.log('Validation successful');
        WebApp.ready();
        WebApp.setHeaderColor(themeParams.header_bg_color);

        const Main = () => {
          const handleSetupComplete = () => {
            // Reload the entire page
            window.location.reload();
          };

          const handleCommunitySelect = (communityId: string) => {
            console.log('Selected Community ID:', communityId);
            // Handle the selected community ID as needed
          };

          return (
            data.community_is_not_specified ? (
              <CommunitiesPicker 
                communities={data.communities} 
                onCommunitySelect={handleCommunitySelect} 
              />
            ) : (
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

