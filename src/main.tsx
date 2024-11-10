import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Global } from '@emotion/react';
import App from './App.tsx';
import SetupApp from './SetupApp';
import SetupAppRequired from './SetupAppRequired.tsx';
import './index.css';

import WebApp from '@twa-dev/sdk';
import { ThemeParams } from '@twa-dev/types';
import { validateAuthorization, sendThemeParams } from './apiService';
import { AuthProvider } from './AuthContext';
import { createAppStyles } from './AppStyles';
import CommunitiesPicker from './CommunitiesPicker.tsx';
import { LocalsCommunity } from './types.ts';
import AdvertiseApp from './advertisement/AdvertiseApp.tsx';

let initDataRawToUse: string;
let themeParams: ThemeParams;

if (import.meta.env.MODE === 'development') {
  //initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22Locals%20Only%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22locals_only_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8299257676485440450&chat_type=sender&start_param=383cff75-c9ae-4bb2-89ff-f212f7bcb8ec&auth_date=1731243309&hash=c4dfe966811543e1d683bc70b6ad58676255af7105d4b8e29caa9aa0e2fe21ec';
  //initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22Locals%20Only%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22locals_only_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8299257676485440450&chat_type=sender&auth_date=1729882697&hash=d9d5617e738cd1caef2d7247e94ac9bdac27bd5b7211bfc57aff99b3704bdfac';
  //initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22Locals%20Only%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22locals_only_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8299257676485440450&chat_type=sender&start_param=383cff75-c9ae-4bb2-89ff-f212f7bcb8ec_8778da3e-05c5-432a-8125-e5bf5b94e093&auth_date=1730581761&hash=0e561f47b68bcb5f24e456219b25b4f6dd368b9ca87c67476e0e97a96f6277aa';
  initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22Locals%20Only%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22locals_only_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8299257676485440450&chat_type=sender&start_param=advertise&auth_date=1730634221&hash=5863f4b57aa796f0e09ac53c252ad8f287c29edc2114ef3683806be21b0c1ba3';

  //themeParams = {'bg_color': '#1e1e1e', 'section_bg_color': '#181819', 'secondary_bg_color': '#000000', 'text_color': '#ffffff', 'hint_color': '#7d7d7d', 'link_color': '#57a7e0', 'button_color': '#50a8eb', 'button_text_color': '#ffffff', 'header_bg_color': '#232326', 'accent_text_color': '#64b5ef', 'section_header_text_color': '#6cb6f8', 'subtitle_text_color': '#7e7e7f', 'destructive_text_color': '#ee686f', 'section_separator_color': '#000000', 'bottom_bar_bg_color': '#000000'};
  themeParams = {'bg_color': '#ffffff', 'section_bg_color': '#ffffff', 'secondary_bg_color': '#f0f0f0', 'text_color': '#222222', 'hint_color': '#a8a8a8', 'link_color': '#3387b2', 'button_color': '#55a9d3', 'button_text_color': '#ffffff', 'header_bg_color': '#517b94', 'accent_text_color': '#2a97c8', 'section_header_text_color': '#2f95bd', 'subtitle_text_color': '#8c8f90', 'destructive_text_color': '#cc2929', 'section_separator_color': '#d9d9d9', 'bottom_bar_bg_color': '#f0f0f0'};
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
          if (data.advertise) {
            return <AdvertiseApp language={data.user.language_code} />
          }


          const [communityId, setCommunityId] = useState<string | null>(
            data.community_is_not_specified ? null : data.community.id
          );

          const handleSetupComplete = () => {
            window.location.reload();
          };

          const handleCommunitySelect = (selectedCommunityId: string) => {
            console.log('Selected Community ID:', selectedCommunityId);
            setCommunityId(selectedCommunityId);
          };

          if (communityId === null && data.communities && data.communities.length > 1) {
            return (
              <CommunitiesPicker 
                communities={data.communities} 
                onCommunitySelect={handleCommunitySelect} 
              />
            );
          } 
          
          let community: LocalsCommunity;
          if (communityId === null && data.communities && data.communities.length === 1) {
            setCommunityId(data.communities[0].id);
            community = data.communities[0];
          } else {
            community = data.community || data.communities.find((c: { id: string }) => c.id === communityId);
          }


          return community.status === 'READY' ? (
            <App 
              community={community} 
              user={data.user}
              focusEntityType={data.entity_type}
              focusEntityId={data.entity?.id}
            />
          ) : (
            data.admin ? (
              <SetupApp 
                onSetupComplete={handleSetupComplete} 
                community={community}
              />
            ) : (
              <SetupAppRequired community={community} />
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
