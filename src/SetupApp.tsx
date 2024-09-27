import React, { useState } from 'react';
import { saveSetupData } from './apiService';
import { useAuth } from './AuthContext';
import { createTranslationFunction } from './utils';
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

interface SetupAppProps {
  onSetupComplete: () => void;
  community: LocalsCommunity;
}

const SetupApp: React.FC<SetupAppProps> = ({ onSetupComplete, community }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [language, setLanguage] = useState<'en' | 'ru'>(community.language as 'en' | 'ru');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const { authorization } = useAuth();
  const t = createTranslationFunction(language);

  const StyledTypography = styled(Typography)({
    color: 'var(--text-color)',
  });

  const StyledSelect = styled(Select)({
    backgroundColor: 'var(--secondary-bg-color)',
    color: 'var(--text-color)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--hint-color)',
    },
  });

  const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--secondary-bg-color)',
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

  const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '16px',
    paddingTop: '0', // Remove top padding
  });

  const StyledContent = styled(Box)({
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto',
    marginTop: '-20vh', // Move content up by 10% of the viewport height
  });

  const StyledIcon = styled('img')({
    width: '120px',  // Increased from 56px
    height: '120px', // Increased from 56px
    borderRadius: '50%',
    padding: '16px', // Increased from 8px
    margin: '0 auto 24px auto', // Increased bottom margin
    display: 'block',
    backgroundColor: 'var(--secondary-bg-color)', // Added for better visibility
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Added for depth
  });

  const languageOptions = [
    { value: 'en', label: '🇬🇧 English' },
    { value: 'ru', label: '🇷🇺 Русский' }
  ];

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        await saveSetupData({ language, location, description }, authorization);
        onSetupComplete();
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

  const steps = [t('selectLanguage'), t('enterLocation'), t('enterDescription')];

  return (
    <div className="app-body">
      <StyledContainer>
        <StyledContent>
          <StyledIcon src="/icon.png" alt="Community Icon" />
          <StyledTypography variant="h4" gutterBottom align="center">
            {t('communitySetup')}
          </StyledTypography>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 2 }}>
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
              <StyledTextField
                fullWidth
                label={t('location')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
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
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
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
            </Box>
          </Box>
        </StyledContent>
      </StyledContainer>
    </div>
  );
};

export default SetupApp;
