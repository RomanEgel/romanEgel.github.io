import React, { useState } from 'react';
import { saveSetupData } from './apiService';
import { useAuth } from './AuthContext';
import { createTranslationFunction } from './utils';
import LocationPicker from './LocationPicker';
import { 
  Typography, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  Box,
  styled,
} from '@mui/material';
import { LocalsCommunity } from './types';
import GoogleMapsProvider from './GoogleMapsProvider';
import { StepConnector, stepConnectorClasses } from '@mui/material';
import { CustomThemeProvider } from './CustomThemeProvider';
const StyledTypography = styled(Typography)({
  color: 'var(--text-color)',
});

const StyledSelect = styled(Select)({
  backgroundColor: 'var(--bg-color)',
  color: 'var(--text-color)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--hint-color)',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    '& fieldset': {
      borderColor: 'var(--hint-color)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'var(--hint-color)',
  },
});

const StyledButton = styled(Button)({
  backgroundColor: 'var(--button-color)',
  color: 'var(--button-text-color)',
  '&:hover': {
    backgroundColor: 'var(--button-color)',
    opacity: 0.8,
  },
  '&:disabled': {
    backgroundColor: 'var(--hint-color)',
    color: 'var(--bg-color)',
    opacity: 0.7,
  },
});

const StyledIcon = styled('img')(() => ({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  padding: '16px',
  margin: '0 auto 24px auto',
  display: 'block',
  backgroundColor: 'var(--secondary-bg-color)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

const StyledMap = styled(Box)({
  width: '100%',
  marginTop: '16px',
  marginBottom: '16px',
});

const StyledContainer = styled('div')({
  padding: '0 16px', // Add horizontal padding
  width: '100%',
  margin: '0 auto', // Center the container
});

const languageOptions = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'ru', label: '🇷🇺 Русский' }
];

const StyledStepConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'var(--button-color)',
      borderStyle: 'solid',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'var(--button-color)',
      borderStyle: 'solid',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: 'var(--hint-color)',
    borderTopWidth: 3,
    borderRadius: 1,
    borderStyle: 'dotted',
  },
}));

const StyledStepper = styled(Stepper)(() => ({
  '& .MuiStepLabel-root .MuiStepLabel-label': {
    color: 'var(--button-color)',
  },
  '& .MuiStepLabel-root .Mui-active .MuiStepLabel-label': {
    color: 'var(--button-color)',
  },
  '& .MuiStepIcon-root': {
    color: 'var(--hint-color)', // Inactive steps
  },
  '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': {
    color: 'var(--button-color)', // Active and completed steps
  },
}));

interface EntityExtractionSettings {
  eventHashtag: string;
  itemHashtag: string;
  serviceHashtag: string;
  newsHashtag: string;
}

interface SetupAppProps {
  onSetupComplete: () => void;
  community: LocalsCommunity;
}

const SetupApp: React.FC<SetupAppProps> = ({ onSetupComplete, community }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [language, setLanguage] = useState<'en' | 'ru'>(community.language as 'en' | 'ru');
  const { authorization } = useAuth();
  const t = createTranslationFunction(language);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [entitySettings, setEntitySettings] = useState<EntityExtractionSettings>({
    eventHashtag: '#event',
    itemHashtag: '#item',
    serviceHashtag: '#service',
    newsHashtag: '#news',
  });

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        if (selectedLocation) {
          await saveSetupData({ language, location: selectedLocation, entitySettings }, authorization, community.id);
          onSetupComplete();
        } else {
          console.error('Location is not selected');
        }
      } catch (error) {
        console.error('Error saving setup data:', error);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleEntitySettingChange = (setting: keyof EntityExtractionSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEntitySettings((prev) => ({ ...prev, [setting]: event.target.value }));
  };

  const steps = [t('selectLanguage'), t('enterLocation'), t('entityExtractionSettings')];

  const isNextDisabled = (activeStep === 1 && !selectedLocation) || 
                         (activeStep === 2 && Object.values(entitySettings).some(value => value.trim() === ''));

  return (
    <CustomThemeProvider>
      <div className="min-h-screen flex flex-col app-body">
        <StyledContainer className="flex-grow flex flex-col app-container">
          <StyledIcon src="/icon.png" alt="Community Icon" />
          <StyledTypography variant="h5" gutterBottom align="center">
            {t('communitySetup')}
          </StyledTypography>
          <StyledStepper activeStep={activeStep} connector={<StyledStepConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{activeStep === index ? label : ''}</StepLabel>
              </Step>
            ))}
          </StyledStepper>
          <div className="flex flex-col">
            <div className="flex flex-col mt-2">
              {activeStep === 0 && (
                <StyledSelect
                  fullWidth
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'ru')}
                  displayEmpty
                >
                  {languageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledSelect>
              )}
              {activeStep === 1 && (
                <div className="flex flex-col">
                  <StyledMap>
                    <GoogleMapsProvider language={language}>
                      <LocationPicker
                        onLocationSelect={handleLocationSelect}
                        language={language}
                      />
                    </GoogleMapsProvider>
                  </StyledMap>
                </div>
              )}
              {activeStep === 2 && (
                <div className="flex flex-col space-y-4">
                  <StyledTextField
                    fullWidth
                    label={t('eventHashtag')}
                    value={entitySettings.eventHashtag}
                    onChange={handleEntitySettingChange('eventHashtag')}
                  />
                  <StyledTextField
                    fullWidth
                    label={t('itemHashtag')}
                    value={entitySettings.itemHashtag}
                    onChange={handleEntitySettingChange('itemHashtag')}
                  />
                  <StyledTextField
                    fullWidth
                    label={t('serviceHashtag')}
                    value={entitySettings.serviceHashtag}
                    onChange={handleEntitySettingChange('serviceHashtag')}
                  />
                  <StyledTextField
                    fullWidth
                    label={t('newsHashtag')}
                    value={entitySettings.newsHashtag}
                    onChange={handleEntitySettingChange('newsHashtag')}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-row pt-2">
              {activeStep > 0 && (
                <StyledButton
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  {t('back')}
                </StyledButton>
              )}
              <Box sx={{ flex: '1 1 auto' }} />
              <StyledButton 
                onClick={handleNext} 
                disabled={isNextDisabled}
              >
                {activeStep === steps.length - 1 ? t('finish') : t('next')}
              </StyledButton>
            </div>
          </div>
        </StyledContainer>
      </div>
    </CustomThemeProvider>
  );
};

export default SetupApp;