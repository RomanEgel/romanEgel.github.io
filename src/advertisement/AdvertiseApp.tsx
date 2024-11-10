import React, { useState, useEffect } from 'react';
import { 
  styled,
  Button,
  List,
  Typography,
  CircularProgress,
  Card,
  IconButton,
  MobileStepper,
} from '@mui/material';
import { CustomThemeProvider } from '../CustomThemeProvider';
import AdvertiseSetup from './AdvertiseSetup';
import AddIcon from '@mui/icons-material/Add';
import { Advertisement } from '../types';
import { createTranslationFunction, showConfirm } from '../utils';
import { useAuth } from '../AuthContext';
import { getAdvertisements, deleteAdvertisement } from '../apiService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const StyledContainer = styled('div')({
  padding: '0 16px',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const StyledTypography = styled(Typography)({
  color: 'var(--text-color)',
  marginBottom: '10px',
});

const StyledButton = styled(Button)({
  backgroundColor: 'var(--button-color)',
  color: 'var(--button-text-color)',
  '&:hover': {
    backgroundColor: 'var(--button-color)',
    opacity: 0.8,
  }
});

const CreateButtonContainer = styled('div')({
  marginBottom: '10px',
});

const ListItemContainer = styled('div')({
  marginBottom: '8px',
  '& .app-card-detail-content': {
    padding: '12px',
    backgroundColor: 'var(--section-bg-color)',
    borderRadius: '8px',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
  }
});

const AdImageContainer = styled('div')({
  width: '140px',
  flexShrink: 0,
});

const AdImage = styled('img')({
  width: '140px',
  height: '140px',
  objectFit: 'cover',
  borderRadius: '4px',
});

const AdContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  height: '140px',
});

const ScrollableList = styled(List)({
  padding: 0,
  flexGrow: 1,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'var(--secondary-bg-color)',
    borderRadius: '4px',
  },
});

const ListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'hidden',
  paddingTop: '48px',
  backgroundColor: 'var(--bg-color)',
});

const ViewsContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginLeft: 'auto',
});

const StyledCard = styled(Card)({
  backgroundColor: 'var(--section-bg-color)',
  borderRadius: '8px',
  cursor: 'default',
  '&:hover': {
    opacity: 1,
  }
});

const CardContent = styled('div')({
  padding: '12px',
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  position: 'relative', // For positioning delete button
});

const DeleteButton = styled(IconButton)({
  position: 'absolute',
  top: '8px',
  right: '8px',
  zIndex: 1,
  color: 'var(--destructive-text-color)',
  backgroundColor: 'var(--bg-color)',
  padding: '4px',
  '&:hover': {
    backgroundColor: 'var(--bg-color)',
    opacity: 0.8,
  }
});

const ImageCarousel = styled('div')({
  position: 'relative',
  width: '140px',
  height: '140px',
  '&:hover .carousel-stepper': {
    opacity: 1,
  },
});

const CarouselStepper = styled(MobileStepper)({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  background: 'rgba(0, 0, 0, 0.3)',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  '& .MuiMobileStepper-dot': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  '& .MuiMobileStepper-dotActive': {
    backgroundColor: 'white',
  },
});

const CarouselButton = styled(IconButton)({
  color: 'white',
  padding: '4px',
  '&.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.3)',
  },
});

interface AdvertiseAppProps {
  language: 'en' | 'ru';
}

const AdvertiseApp: React.FC<AdvertiseAppProps> = ({ language }) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create'>('list');
  const t = createTranslationFunction(language);
  const { authorization } = useAuth();

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    setIsLoading(true);
    try {
      const data = await getAdvertisements(authorization);
      console.log('Advertisements:', data);
      setAdvertisements(data["advertisements"]);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setView('create');
  };

  const handleBack = () => {
    setView('list');
    fetchAdvertisements(); // Refresh the list when coming back
  };

  const handleDeleteAd = async (adId: string) => {
    showConfirm(t('confirmDeleteAdvertisement'), (confirmed: boolean) => {
      if (confirmed) {
        try {
          setIsLoading(true);
          deleteAdvertisement(adId, authorization)
            .then(() => {
              return fetchAdvertisements(); // Refresh the list after deletion
            })
            .catch((error) => {
              console.error('Error deleting advertisement:', error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } catch (error) {
          console.error('Error deleting advertisement:', error);
        }
      }
    });
  };

  const renderContent = () => {
    switch (view) {
      case 'create':
        return <AdvertiseSetup language={language} onBack={handleBack} />;
      default:
        return (
          <>
            <div className="app-header flex items-center">
              <Typography variant="h5">
                {t('yourAdvertisements')}
              </Typography>
            </div>
            
            {isLoading ? (
              <div className="flex-grow flex items-center justify-center">
                <CircularProgress />
              </div>
            ) : advertisements.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center">
                <StyledTypography variant="body1" className="mb-4">
                  {t('noAdvertisementsYet')}
                </StyledTypography>
                <StyledButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateClick}
                  
                >
                  {t('createAdvertisement')}
                </StyledButton>
              </div>
            ) : (
              <ListContainer>
                <CreateButtonContainer>
                  <StyledButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateClick}
                    fullWidth
                  >
                    {t('createAdvertisement')}
                  </StyledButton>
                </CreateButtonContainer>
                <ScrollableList>
                  {advertisements.map((ad) => (
                    <ListItemContainer key={ad.id}>
                      <StyledCard>
                        <CardContent className="app-card-detail-content">
                          <DeleteButton
                            onClick={() => handleDeleteAd(ad.id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </DeleteButton>
                          
                          {ad.images && ad.images.length > 0 && (
                            <AdImageContainer>
                              <ImageCarouselComponent images={ad.images} />
                            </AdImageContainer>
                          )}
                          <AdContent>
                            <Typography 
                              variant="subtitle1" 
                              style={{ 
                                fontWeight: 'bold', 
                                color: 'var(--text-color)',
                                lineHeight: 1.2,
                              }}
                            >
                              {ad.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              className="app-price"
                              style={{ marginTop: '8px' }}
                            >
                              {ad.price} {ad.currency}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'var(--subtitle-text-color)',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginTop: '8px',
                                flex: 1,
                              }}
                            >
                              {ad.description}
                            </Typography>
                            <ViewsContainer>
                              <VisibilityIcon sx={{ fontSize: 16, color: 'var(--subtitle-text-color)' }} />
                              <Typography 
                                variant="body2" 
                                sx={{ color: 'var(--subtitle-text-color)' }}
                              >
                                {ad.views || 0}
                              </Typography>
                            </ViewsContainer>
                          </AdContent>
                        </CardContent>
                      </StyledCard>
                    </ListItemContainer>
                  ))}
                </ScrollableList>
              </ListContainer>
            )}
          </>
        );
    }
  };
  
  return (
    <CustomThemeProvider>
      <div className="min-h-screen flex flex-col app-body">
        <StyledContainer className="flex-grow flex flex-col app-container">
          {renderContent()}
        </StyledContainer>
      </div>
    </CustomThemeProvider>
  );
};

const ImageCarouselComponent: React.FC<{ images: string[] }> = ({ images }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <ImageCarousel>
      <AdImage
        src={images[activeStep]}
        alt={`Image ${activeStep + 1}`}
        loading="lazy"
      />
      {images.length > 1 && (
        <CarouselStepper
          className="carousel-stepper"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <CarouselButton
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              <KeyboardArrowRight />
            </CarouselButton>
          }
          backButton={
            <CarouselButton
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
            </CarouselButton>
          }
        />
      )}
    </ImageCarousel>
  );
};

export default AdvertiseApp; 