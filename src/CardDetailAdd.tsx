import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { ListItem, LocalsCommunity, LocalsItem, LocalsService, LocalsEvent, LocalsNews } from './types';
import { createTranslationFunction } from './utils';
import { 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl,
  Button
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CustomThemeProvider, getCSSVariableValue } from './CustomThemeProvider';
import { 
  StyledDialog, 
  StyledDialogTitle, 
  StyledDialogContent, 
  StyledDialogActions, 
  StyledButton, 
  StyledTextField 
} from './SharedComponents';

interface CardDetailAddProps {
  community: LocalsCommunity;
  active_tab: string;
  onClose: () => void;
  onAdd: (newItem: ListItem) => void;
}

type NewItemType = Partial<LocalsItem | LocalsService | LocalsEvent | LocalsNews>;

const CardDetailAdd: React.FC<CardDetailAddProps> = ({ 
  community,
  active_tab,
  onClose, 
  onAdd,
}) => {
  const t = createTranslationFunction(community.language);
  const [newItem, setNewItem] = useState<NewItemType>({
    title: '',
    description: '',
    category: '',
    images: [],
    ...(active_tab === 'items' || active_tab === 'services' ? { price: 0, currency: 'USD' } : {}),
    ...(active_tab === 'events' ? { date: new Date().toISOString() } : {}),
  });

  useEffect(() => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(onClose);

    return () => {
      WebApp.BackButton.hide();
      WebApp.BackButton.offClick(onClose);
    };
  }, [onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewItem(prev => {
      if (name === 'price') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleDateTimeChange = (dateTime: dayjs.Dayjs | null) => {
    if (dateTime) {
      setNewItem(prev => ({ ...prev, date: dateTime.toISOString() }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setNewItem(prev => ({ ...prev, price: parseFloat(value) || 0 }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Add validation here
    onAdd(newItem as ListItem);
  };

  return (
    <CustomThemeProvider>
      <div className="flex-grow flex flex-col app-container">
        <StyledDialog open={true} onClose={onClose} fullScreen>
          <StyledDialogTitle>{t('add')}</StyledDialogTitle>
          <StyledDialogContent>
            <StyledTextField
              fullWidth
              margin="normal"
              name="title"
              label={t('title')}
              value={newItem.title}
              onChange={handleInputChange}
            />
            {(active_tab === 'items' || active_tab === 'services') && (
              <div className="flex gap-2 my-4">
                <StyledTextField
                  fullWidth
                  name="price"
                  label={t('price')}
                  type="number"
                  value={(newItem as LocalsItem | LocalsService).price}
                  onChange={handlePriceChange}
                />
                <FormControl fullWidth>
                  <InputLabel>{t('currency')}</InputLabel>
                  <Select
                    name="currency"
                    value={(newItem as LocalsItem | LocalsService).currency}
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
            {active_tab === 'events' && (
              <LocalizationProvider 
                dateAdapter={AdapterDayjs} 
                adapterLocale={community.language === 'ru' ? 'ru' : 'en'}
              >
                <DateTimePicker
                  label={t('date')}
                  value={dayjs((newItem as LocalsEvent).date)}
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
              value={newItem.description}
              onChange={handleInputChange}
            />
            <StyledTextField
              fullWidth
              margin="normal"
              name="category"
              label={t('category')}
              value={newItem.category}
              onChange={handleInputChange}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                variant="contained"
                component="span"
                fullWidth
                sx={{
                  marginTop: 2,
                  marginBottom: 2,
                  backgroundColor: getCSSVariableValue("--button-color"),
                  color: getCSSVariableValue("--button-text-color"),
                }}
              >
                {t('uploadImage')}
              </Button>
            </label>
            {newItem.images && newItem.images.length > 0 && (
              <img src={newItem.images[0]} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />
            )}
          </StyledDialogContent>
          <StyledDialogActions>
            <StyledButton onClick={onClose}>{t('cancel')}</StyledButton>
            <StyledButton onClick={handleSubmit}>{t('add')}</StyledButton>
          </StyledDialogActions>
        </StyledDialog>
      </div>
    </CustomThemeProvider>
  );
};

export default CardDetailAdd;