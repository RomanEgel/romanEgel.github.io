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
  Modal,
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

interface SetupAppProps {
  onSetupComplete: () => void;
  community: LocalsCommunity;
}

const SetupApp: React.FC<SetupAppProps> = ({ onSetupComplete, community }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [language, setLanguage] = useState<'en' | 'ru'>(community.language as 'en' | 'ru');
  const [description, setDescription] = useState('');
  const { authorization } = useAuth();
  const t = createTranslationFunction(language);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        if (selectedLocation) {
          await saveSetupData({ language, location: selectedLocation, description }, authorization);
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

  const steps = [t('selectLanguage'), t('enterLocation'), t('enterDescription')];

  return (
    <CustomThemeProvider>
      <div className = 'min-h-screen flex flex-col app-body'>
        <div className = 'flex-grow flex flex-col app-container'>
          <StyledIcon src="/icon.png" alt="Community Icon" />
          <StyledTypography variant="h4" gutterBottom align="center">
            {t('communitySetup')}
          </StyledTypography>
          <StyledStepper activeStep={activeStep} connector={<StyledStepConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{activeStep === index ? label : ''}</StepLabel>
              </Step>
            ))}
          </StyledStepper>
          <div className = 'flex flex-col'>
          <div className = 'flex flex-col mt-2'>
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
              <div className = 'flex flex-col'>
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
              <StyledTextField
                fullWidth
                multiline
                rows={4}
                label={t('description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            )}
          </div>
          <div className = 'flex flex-row pt-2'>
              {activeStep > 0 && (
                <StyledButton
                  color="inherit"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  {t('back')}
                </StyledButton>
              )}
              <Box sx={{ flex: '1 1 auto' }} />
              <StyledButton onClick={handleNext}>
                {activeStep === steps.length - 1 ? t('finish') : t('next')}
              </StyledButton>
            </div>
            </div>
        </div>
      </div>
    </CustomThemeProvider>
  );
};

export default SetupApp;
