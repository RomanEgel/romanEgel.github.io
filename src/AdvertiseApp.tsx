import React, { useState, useEffect } from 'react';
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
import { useAuth } from './AuthContext';
import { createAdvertisement, fetchCommunityCoordinates } from './apiService';
import WebApp from '@twa-dev/sdk';

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Validate coordinates
  if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90 || 
      Math.abs(lon1) > 180 || Math.abs(lon2) > 180) {
    console.error('Invalid coordinates detected:', { lat1, lon1, lat2, lon2 });
    return Infinity;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Round to 2 decimal places to avoid floating point issues
  return Math.round(distance * 100) / 100;
};

const getCommunitiesInRange = (
  lat: number,
  lng: number,
  communities: Array<{lat: number; lng: number}>,
  range: number
): Array<{lat: number; lng: number}> => {
  return communities.filter(community => 
    calculateDistance(lat, lng, community.lat, community.lng) <= range
  );
};

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

const getDefaultCurrency = (language: 'en' | 'ru'): string => {
  switch (language) {
    case 'ru':
      return 'RUB';
    default:
      return 'EUR';
  }
};

const AdvertiseApp: React.FC<AdvertiseAppProps> = ({ language }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [advertiseType, setAdvertiseType] = useState<AdvertiseType | null>(null);
  const [range, setRange] = useState<number>(100);
  const [formData, setFormData] = useState<Partial<LocalsItem | LocalsService>>({
    currency: getDefaultCurrency(language),
  });
  const [formErrors, setFormErrors] = useState<{
    title: string;
    description: string;
    price: string;
  }>({
    title: '',
    description: '',
    price: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const t = createTranslationFunction(language);
  const { authorization } = useAuth();
  const [communityPins, setCommunityPins] = useState<Array<{lat: number; lng: number}>>([]);
  const [communitiesInRange, setCommunitiesInRange] = useState<Array<{lat: number; lng: number}>>([]);
  const [locationError, setLocationError] = useState<string>('');

  const rangeMarks = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      createAdvertisement(formData.title!!, formData.description!!, formData.price!!, formData.currency!!, advertiseType!!, location!!, range, authorization)
        .then(response => {
          if (response.status === 200) {
            console.log('Advertisement created:', response);
            WebApp.showConfirm(t('advertisementCreated'), () => WebApp.close());
          } else {
            console.log('Advertisement creation failed:', response);
            WebApp.showAlert(t('advertisementCreationFailed'));
          }
        }).catch(error => {
          console.error('Error creating advertisement:', error);
          WebApp.showAlert(t('advertisementCreationFailed'));
        });
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
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
  const validateFormData = (): boolean => {
    return Object.values(formErrors).every(error => error === '')
      && Boolean(formData?.title) 
      && Boolean(formData?.description)
      && Boolean(formData?.price)
      && Boolean(formData?.currency);
  };

  const isNextDisabled = (activeStep === 0 && !location) ||
                        (activeStep === 1 && (!range || communitiesInRange.length === 0)) ||
                        (activeStep === 2 && !advertiseType) ||
                        (activeStep === 3 && images.length === 0) ||
                        (activeStep === 4 && !validateFormData());


  const handleFormStateChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleErrorChange = (name: string, value: string) => {
    setFormErrors(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (newImages: File[]) => {
    // Cleanup old URLs
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Create new URLs
    const newUrls = newImages.map(image => URL.createObjectURL(image));
    
    setImages(newImages);
    setImageUrls(newUrls);
  };

  useEffect(() => {
    const loadCommunityCoordinates = async () => {
      if (!authorization) return;
      
      try {
        const coordinates = await fetchCommunityCoordinates(authorization);
        setCommunityPins(coordinates);
      } catch (error) {
        console.error('Error fetching community coordinates:', error);
      }
    };

    loadCommunityCoordinates();
  }, [authorization]);

  useEffect(() => {
    return () => {
      // Cleanup all image URLs when component unmounts
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  useEffect(() => {
    if (location && communityPins.length > 0) {
      // Log distances to all communities for debugging
      communityPins.forEach(pin => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          pin.lat,
          pin.lng
        );
        console.log(`Distance to community at (${pin.lat}, ${pin.lng}): ${distance.toFixed(2)} km`);
      });

      const communities = getCommunitiesInRange(
        location.lat,
        location.lng,
        communityPins,
        range
      );
      console.log(`Found ${communities.length} communities within ${range} km`);
      setCommunitiesInRange(communities);
      if (communities.length === 0) {
        setLocationError(t('locationTooFarFromCommunities').replace('{{range}}', range.toString()));
      } else {
        setLocationError('');
      }
    }
  }, [location, range, communityPins]);

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
              <>
                {locationError && (
                  <StyledTypography 
                    variant="body2" 
                    align="center" 
                    sx={{ 
                      color: 'error.main',
                      marginTop: '16px',
                      marginBottom: '-8px'
                    }}
                  >
                    {locationError}
                  </StyledTypography>
                )}
                <StyledMap>
                  <GoogleMapsProvider language={language}>
                    <LocationPicker
                      location={location}
                      onLocationSelect={handleLocationSelect}
                      language={language}
                      pins={communityPins}
                    />
                  </GoogleMapsProvider>
                </StyledMap>
              </>
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
                {communitiesInRange.length === 0 && (
                  <StyledTypography 
                    variant="body2" 
                    align="center" 
                    sx={{ color: 'error.main' }}
                  >
                    {t('noCommunitiesInRange')}
                  </StyledTypography>
                )}
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
                  language={language}
                  formState={{
                    title: formData.title ?? '',
                    description: formData.description ?? '',
                    price: formData.price?.toString() ?? '',
                    currency: formData.currency ?? '',
                  }}
                  errors={formErrors}
                  onErrorChange={handleErrorChange}
                  onFormStateChange={handleFormStateChange}
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