/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { LocalsCommunity } from './types';
import { createTranslationFunction } from './utils';

interface SetupAppRequiredProps {
  community: LocalsCommunity;
}

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const SetupAppRequired: React.FC<SetupAppRequiredProps> = ({ community }) => {
  const t = createTranslationFunction(community.language || 'en');
  
  return (
    <div className="app-body">
      <div className="app-container">
        <div css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        `}>
          <img 
            src="icon.png" 
            alt="App Icon" 
            css={css`
              width: 128px;
              height: 128px;
              margin-bottom: 24px;
              border-radius: 50%;
              object-fit: cover;
              animation: ${pulse} 2s ease-in-out infinite;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            `} 
          />
          <p className="app-text">{community.name} {t('ongoingSetup')}</p>
          <div css={css`
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #ffffff;
            animation: ${spin} 1s linear infinite;
            margin-top: 20px;
          `} />
        </div>
      </div>
    </div>
  );
};

export default SetupAppRequired;