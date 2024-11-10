import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { MessageCircle, UserCircle, Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { ListItem, LocalsCommunity } from './types';
import { formatDate, formatPrice, createTranslationFunction, showConfirm } from './utils';
import { 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl 
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // Import Russian locale
import 'dayjs/locale/en'; // Import English locale
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { theme } from './theme';
import { CustomThemeProvider, getCSSVariableValue } from './CustomThemeProvider';
import { 
  StyledDialog, 
  StyledDialogTitle, 
  StyledDialogContent, 
  StyledDialogActions, 
  StyledButton, 
  StyledTextField 
} from './SharedComponents';

interface CardDetailViewProps {
  item: ListItem;
  community: LocalsCommunity;
  active_tab: string;
  onOpenUserProfile: (userId: string, text: string) => void;
  onClose: () => void;
  communityLanguage: 'en' | 'ru';
  isCurrentUserAuthor: boolean; // New prop
  onDelete?: (item_id: string, active_tab: string) => void; // New prop for delete functionality
  onEdit?: (item: ListItem, active_tab: string) => void; // New prop for edit functionality
}

const DetailImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    setImageLoaded(true);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 md:h-80 lg:h-96 app-image-container flex items-center justify-center">
        <div className="app-hint">No image available</div>
      </div>
    );
  }

  const getImageStyle = () => {
    if (!imageLoaded) return {};
    
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    const containerAspectRatio = 16 / 9; // Typical container aspect ratio

    return {
      objectFit: aspectRatio > containerAspectRatio ? 'contain' : 'cover',
      maxHeight: '100%',
      maxWidth: '100%',
      margin: 'auto'
    } as React.CSSProperties;
  };

  return (
    <div className="w-full h-64 md:h-80 lg:h-96 relative app-image-container/5">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse app-section-bg-color w-full h-full" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src={images[currentIndex]} 
          alt="Item" 
          className="transition-opacity duration-300"
          style={{
            ...getImageStyle(),
            opacity: imageLoaded ? 1 : 0
          }}
          onLoad={handleImageLoad}
        />
      </div>
      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 app-button-text" />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="h-6 w-6 app-button-text" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? 'app-button-text' : 'app-hint'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CardDetailView: React.FC<CardDetailViewProps> = ({ 
  item, 
  community,
  active_tab,
  onOpenUserProfile,
  onClose, 
  communityLanguage, 
  isCurrentUserAuthor,
  onDelete,
  onEdit
}) => {
  const t = createTranslationFunction(communityLanguage);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<ListItem>(item);

  useEffect(() => {
    // Show the back button when the component mounts
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(onClose);

    // Hide the back button when the component unmounts
    return () => {
      WebApp.BackButton.hide();
      WebApp.BackButton.offClick(onClose);
    };
  }, [onClose]);

  const openTelegramLink = (url: string) => {
    WebApp.openTelegramLink(url);
  };

  const handleDelete = () => {
    showConfirm(
      t('deleteConfirmation'),
      (confirmed: boolean) => {
        if (confirmed && onDelete) {
          onDelete(item.id, active_tab);
        }
      }
    );
  };

  const messageLink = `https://t.me/c/${community.chatId.toString().slice(4)}/${item.messageId}`;

  let contactText: string;
  switch (active_tab) {
    case 'items':
      contactText = t('interestedInItemMessage');
      break;
    case 'services':
      contactText = t('interestedInServiceMessage');
      break;
    case 'events':
      contactText = t('interestedInEventMessage');
      break;
    case 'news':
      contactText = t('interestedInNewsMessage');
      break;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(editedItem, active_tab);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setEditedItem(prev => {
      if (name === 'price') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleDateTimeChange = (dateTime: dayjs.Dayjs | null) => {
    if (dateTime) {
      setEditedItem(prev => ({ ...prev, date: dateTime.toISOString() }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setEditedItem(prev => ({ ...prev, price: parseFloat(value) || 0 }));
    }
  };

  return (
    <CustomThemeProvider>
      <div className="flex-grow flex flex-col app-container">
        <div className="app-header flex justify-end items-center p-2">
          {isCurrentUserAuthor && !isEditing && (
            <div>
              <button onClick={handleEdit} className="p-2 app-button-edit rounded-full mr-2">
                <Pencil className="h-5 w-5" />
              </button>
              <button onClick={handleDelete} className="p-2 app-button-delete rounded-full">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto app-card-detail-content">
          <DetailImageCarousel images={item.images || []} />
          
          <div className="p-4">
            {!isEditing && (
              <>
                <h2 className="text-lg font-semibold mb-4 app-text">{item.title}</h2>
                {'price' in item && 'currency' in item && (
                  <p className="font-bold app-price text-lg mb-2">
                    <span className="app-text">{t('price')}:</span> {formatPrice(item.price, item.currency, communityLanguage)}
                  </p>
                )}
                {'date' in item && (
                  <p className="font-bold app-event-date text-lg mb-2">
                    {formatDate(item.date, true, communityLanguage)}
                  </p>
                )}
                <div className="flex justify-between items-center mb-4 text-sm">
                  <p className="app-author-text">
                    {t('postedBy')} <span className="app-author">{item.author}</span>
                  </p>
                  <p className="app-publication-date">
                    {formatDate(item.publishedAt, false, communityLanguage)}
                  </p>
                </div>
                <p className="app-text mb-4">{item.description}</p>
              </>
            )}
          </div>
        </div>

        <nav className="app-bottom-bar" style={{ backgroundColor: theme.palette.background.paper }}>
          <div className="flex justify-around">
            {!isEditing && (
              <>
                <button
                  onClick={() => openTelegramLink(messageLink)}
                  className="flex-1 py-4 app-button"
                >
                  <MessageCircle className="h-5 w-5 inline-block mr-2" />
                  <span>{t('viewInChat')}</span>
                </button>
                {!isCurrentUserAuthor && (
                  <>
                    <div className="w-0.5"/>
                    <button
                      onClick={() => onOpenUserProfile(item.userId, contactText + item.title)}
                      className="flex-1 py-4 app-button"
                    >
                      <UserCircle className="h-5 w-5 inline-block mr-2" />
                      <span>{t('contactAuthor')}</span>
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </nav>

        <StyledDialog open={isEditing} onClose={handleCancel} fullScreen>
          <StyledDialogTitle>{t('edit')}</StyledDialogTitle>
          <StyledDialogContent>
            <StyledTextField
              fullWidth
              margin="normal"
              name="title"
              label={t('title')}
              value={editedItem.title}
              onChange={handleInputChange}
            />
            {'price' in editedItem && 'currency' in editedItem && (
              <div className="flex gap-2 my-4">
                <StyledTextField
                  fullWidth
                  name="price"
                  label={t('price')}
                  type="number"
                  value={editedItem.price}
                  onChange={handlePriceChange}
                />
                <FormControl fullWidth>
                  <InputLabel>{t('currency')}</InputLabel>
                  <Select
                    name="currency"
                    value={editedItem.currency}
                    onChange={handleInputChange}
                    label={t('currency')}
                    sx={{
                      backgroundColor: getCSSVariableValue("--bg-color"),
                    }}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="RUB">RUB</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
            {'date' in editedItem && (
              <LocalizationProvider 
                dateAdapter={AdapterDayjs} 
                adapterLocale={communityLanguage === 'ru' ? 'ru' : 'en'}
              >
                <DateTimePicker
                  label={t('date')}
                  value={dayjs(editedItem.date)}
                  onChange={handleDateTimeChange}
                  sx={{
                    backgroundColor: getCSSVariableValue("--bg-color"),
                  }}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true, 
                      margin: "normal",
                    } 
                  }}
                />
              </LocalizationProvider>
            )}
            <StyledTextField
              fullWidth
              margin="normal"
              name="description"
              label={t('description')}
              multiline
              rows={4}
              value={editedItem.description}
              onChange={handleInputChange}
            />
          </StyledDialogContent>
          <StyledDialogActions>
            <StyledButton onClick={handleCancel}>{t('cancel')}</StyledButton>
            <StyledButton onClick={handleSave}>{t('save')}</StyledButton>
          </StyledDialogActions>
        </StyledDialog>
      </div>
    </CustomThemeProvider>
  );
};

export default CardDetailView;