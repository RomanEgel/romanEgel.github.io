import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  styled,
  StepConnector,
  stepConnectorClasses,
  Slider
} from '@mui/material';
import { CustomThemeProvider } from './CustomThemeProvider';
import LocationPicker from './LocationPicker';
import { createTranslationFunction } from './utils';
import GoogleMapsProvider from './GoogleMapsProvider';
import AdvertisementForm from './AdvertisementForm';
import { LocalsItem, LocalsService } from './types';
import ImageUpload from './ImageUpload';

const StyledMap = styled('div')({
  width: '100%',
  marginTop: '16px',
  marginBottom: '16px',
});

const StyledTypography = styled(Typography)({
  color: 'var(--text-color)',
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

const StyledContainer = styled('div')({
  padding: '0 16px',
  width: '100%',
  margin: '0 auto',
});

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
    color: 'var(--hint-color)',
  },
  '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': {
    color: 'var(--button-color)',
  },
}));

const StyledFlexRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '16px',
});

const StyledFlexColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignItems: 'center',
});

const StyledButtonGroup = styled('div')({
  display: 'flex',
  gap: '16px',
});

const StyledSpacer = styled('div')({
  flex: '1 1 auto',
});

const StyledToggleButton = styled(Button)<{ $isActive?: boolean }>(({ $isActive }) => ({
  backgroundColor: $isActive ? 'var(--button-color)' : 'var(--hint-color)',
  color: $isActive ? 'var(--button-text-color)' : 'var(--text-color)',
  '&:hover': {
    backgroundColor: $isActive ? 'var(--button-color)' : 'var(--secondary-bg-color)',
    opacity: 0.8,
  },
}));

const StyledSliderContainer = styled('div')({
  width: '100%',
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

type AdvertiseType = 'service' | 'item';

interface AdvertiseAppProps {
  language: 'en' | 'ru';
}

const AdvertiseApp: React.FC<AdvertiseAppProps> = ({ language }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [advertiseType, setAdvertiseType] = useState<AdvertiseType | null>(null);
  const [range, setRange] = useState<number>(5);
  const [formData, setFormData] = useState<Partial<LocalsItem | LocalsService> | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const t = createTranslationFunction(language);

  const rangeMarks = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleTypeSelect = (type: AdvertiseType) => {
    setAdvertiseType(type);
    // Here you can add the submission logic
  };

  const steps = [
    t('enterLocation'), 
    t('selectRange'), 
    t('selectAdvertiseType'),
    t('uploadImages'),
    t('enterDetails')
  ];

  const isNextDisabled = (activeStep === 0 && !location) || 
                        (activeStep === 1 && !range) ||
                        (activeStep === 2 && !advertiseType) ||
                        (activeStep === 3 && images.length === 0) ||
                        (activeStep === 4 && !formData);

  const handleFormSubmit = (data: typeof formData) => {
    setFormData(data);
    if (activeStep === steps.length - 1) {
      // Handle final submission
      console.log('Final submission:', {
        location,
        range,
        advertiseType,
        formData: data
      });
    } else {
      handleNext();
    }
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  return (
    <CustomThemeProvider>
      <div className="min-h-screen flex flex-col app-body">
        <StyledContainer className="flex-grow flex flex-col app-container">
          <StyledIcon src="/icon.png" alt="Advertise Icon" />
          <StyledTypography variant="h5" gutterBottom align="center">
            {t('createAdvertisement')}
          </StyledTypography>
          
          <StyledStepper activeStep={activeStep} connector={<StyledStepConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{activeStep === index ? label : ''}</StepLabel>
              </Step>
            ))}
          </StyledStepper>

          <div className="flex flex-col">
            {activeStep === 0 && (
              <StyledMap>
                <GoogleMapsProvider language={language}>
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    language={language}
                  />
                </GoogleMapsProvider>
              </StyledMap>
            )}
            
            {activeStep === 1 && (
              <StyledSliderContainer>
                <StyledTypography variant="h6" align="center">
                  {t('selectAdvertisementRange')}
                </StyledTypography>
                <Slider
                  value={range}
                  onChange={(_, newValue) => setRange(newValue as number)}
                  min={5}
                  max={100}
                  step={null}
                  marks={rangeMarks}
                  valueLabelDisplay="auto"
                  sx={{
                    width: '80%',
                    color: 'var(--button-color)',
                    '& .MuiSlider-valueLabel': {
                      color: 'var(--text-color)',
                      backgroundColor: 'var(--secondary-bg-color)',
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: 'var(--hint-color)',
                    },
                    '& .MuiSlider-markActive': {
                      backgroundColor: 'var(--button-color)',
                    },
                    '& .MuiSlider-markLabel': {
                      color: 'var(--text-color)',
                    },
                  }}
                />
                <StyledTypography variant="body1" align="center">
                  {t('rangeDescription').replace('{{range}}', range.toString())}
                </StyledTypography>
              </StyledSliderContainer>
            )}
            
            {activeStep === 2 && (
              <StyledFlexColumn>
                <StyledTypography variant="h6" align="center">
                  {t('whatWouldYouLikeToAdvertise')}
                </StyledTypography>
                <StyledButtonGroup>
                  <StyledToggleButton
                    onClick={() => handleTypeSelect('service')}
                    variant="contained"
                    $isActive={advertiseType === 'service'}
                  >
                    {t('service_advertisement_description')}
                  </StyledToggleButton>
                  <StyledToggleButton
                    onClick={() => handleTypeSelect('item')}
                    variant="contained"
                    $isActive={advertiseType === 'item'}
                  >
                    {t('item_advertisement_description')}
                  </StyledToggleButton>
                </StyledButtonGroup>
              </StyledFlexColumn>
            )}
            
            {activeStep === 3 && (
              <StyledFlexColumn>
                <StyledTypography variant="h6" align="center">
                  {t('uploadImages')}
                </StyledTypography>
                <ImageUpload 
                  images={images}
                  onChange={handleImagesChange}
                  maxImages={5}
                  language={language}
                />
              </StyledFlexColumn>
            )}
            
            {activeStep === 4 && (
              <StyledFlexColumn>
                <AdvertisementForm
                  type={advertiseType!}
                  onSubmit={handleFormSubmit}
                  language={language}
                  // TODO: get categories from backend
                  categories={[{ id: '1', name: 'Other' }]}
                />
              </StyledFlexColumn>
            )}
          </div>

          <StyledFlexRow>
            {activeStep > 0 && (
              <StyledButton onClick={handleBack} sx={{ mr: 1 }}>
                {t('back')}
              </StyledButton>
            )}
            <StyledSpacer />
            <StyledButton 
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              {activeStep === steps.length - 1 ? t('finish') : t('next')}
            </StyledButton>
          </StyledFlexRow>
        </StyledContainer>
      </div>
    </CustomThemeProvider>
  );
};

export default AdvertiseApp; 