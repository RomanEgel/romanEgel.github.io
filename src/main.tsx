import React from 'react'
import ReactDOM from 'react-dom/client'
import { Global } from '@emotion/react'
import App from './App.tsx'
import './index.css'

import WebApp from '@twa-dev/sdk'
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { validateAuthorization } from './apiService';
import { AuthProvider } from './AuthContext';
import { createAppStyles, ThemeColors } from './AppStyles';

let initDataRawToUse: string;
let themeColors: ThemeColors = {
  bg_color: "#17212b",
  text_color: "#f5f5f5",
  button_color: "#5288c1",
  button_text_color: "#ffffff",
  hint_color: "#708499",
  link_color: "#6ab3f3",
  secondary_bg_color: "#232e3c",
  subtitle_text_color: "#708499",
  accent_text_color: "#6ab2f2",
  destructive_text_color: "#ec3942",
  header_bg_color: "#17212b",
  section_bg_color: "#17212b",
  section_header_text_color: "#6ab3f3",
  section_separator_color: "#232e3c",
};

if (import.meta.env.MODE === 'development') {
  initDataRawToUse = 'user=%7B%22id%22%3A6601444385%2C%22first_name%22%3A%22AI%20Knowledge%20Base%20App%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ai_kbase_app%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8152347450021945498&chat_type=supergroup&start_param=-1002434020920&auth_date=1727102388&hash=5930aa55ebb2c4ae56bf39b3bf39d15d423010aaef46cfc43115e45bb6936b46';
} else {
  const { initDataRaw, themeParams } = retrieveLaunchParams();
  initDataRawToUse = initDataRaw || '';
  themeColors = {
    bg_color: themeParams['bgColor'] || themeColors.bg_color,
    text_color: themeParams['textColor'] || themeColors.text_color,
    button_color: themeParams['buttonColor'] || themeColors.button_color,
    button_text_color: themeParams['buttonTextColor'] || themeColors.button_text_color,
    hint_color: themeParams['hintColor'] || themeColors.hint_color,
    link_color: themeParams['linkColor'] || themeColors.link_color,
    secondary_bg_color: themeParams['secondaryBgColor'] || themeColors.secondary_bg_color,
    subtitle_text_color: themeParams['subtitleTextColor'] || themeColors.subtitle_text_color,
    accent_text_color: themeParams['accentTextColor'] || themeColors.accent_text_color,
    destructive_text_color: themeParams['destructiveTextColor'] || themeColors.destructive_text_color,
    header_bg_color: themeParams['headerBgColor'] || themeColors.header_bg_color,
    section_bg_color: themeParams['sectionBgColor'] || themeColors.section_bg_color,
    section_header_text_color: themeParams['sectionHeaderTextColor'] || themeColors.section_header_text_color,
    section_separator_color: themeParams['sectionSeparatorColor'] || themeColors.section_separator_color,
  };
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
            <Global styles={createAppStyles(themeColors)} />
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
      WebApp.showAlert('Failed to validate. Please try again later.');
      WebApp.close();
    });
}

