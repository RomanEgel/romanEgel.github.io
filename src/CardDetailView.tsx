import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { MessageCircle, UserCircle, Trash2, Pencil, Save, X } from 'lucide-react';
import { ListItem } from './types';
import { formatDate, formatPrice, createTranslationFunction, showConfirm } from './utils';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField as MuiTextField, 
  Button, 
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
import { styled } from '@mui/system';
import { CustomThemeProvider, getCSSVariableValue } from './CustomThemeProvider';

interface CardDetailViewProps {
  item: ListItem;
  active_tab: string;
  onClose: () => void;
  communityLanguage: 'en' | 'ru';
  isCurrentUserAuthor: boolean; // New prop
  onDelete?: (item_id: string, active_tab: string) => void; // New prop for delete functionality
  onEdit?: (item: ListItem, active_tab: string) => void; // New prop for edit functionality
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.default,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  color: getCSSVariableValue('--button-text-color'),
  backgroundColor: getCSSVariableValue('--button-color'),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  backgroundColor: getCSSVariableValue("--bg-color"),
  '& .MuiInputBase-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}));

const CardDetailView: React.FC<CardDetailViewProps> = ({ 
  item, 
  active_tab,
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

  const messageLink = `https://t.me/c/${item.communityId.toString().slice(4)}/${item.messageId}`;

  let contactText;
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
  const contactAuthorLink = `https://t.me/${item.username}?text=${encodeURIComponent(contactText + item.title)}`;

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
              <button onClick={handleEdit} className="p-2 bg-white bg-opacity-70 rounded-full app-button-edit mr-2">
                <Pencil className="h-5 w-5" />
              </button>
              <button onClick={handleDelete} className="p-2 bg-white bg-opacity-70 rounded-full app-button-delete">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto app-card-detail-content">
          <div className="w-full h-64 md:h-80 lg:h-96 relative app-image-container">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="p-4" style={{ color: theme.palette.text.primary }}>
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
                    {formatDate(item.date, true, communityLanguage)} {/* Add a parameter to include time */}
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
                      onClick={() => openTelegramLink(contactAuthorLink)}
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