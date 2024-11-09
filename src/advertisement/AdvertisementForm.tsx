import React from 'react';
import { 
  TextField, 
  styled,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { createTranslationFunction } from '../utils';


const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: 'var(--text-color)',
  },
  '& .MuiInputLabel-root': {
    color: 'var(--hint-color)',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--hint-color)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--button-color)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--button-color)',
    },
  },
});

const StyledFormControl = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    color: 'var(--text-color)',
    '& fieldset': {
      borderColor: 'var(--hint-color)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--button-color)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--button-color)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'var(--hint-color)',
  },
  '& .MuiSelect-icon': {
    color: 'var(--text-color)',
  },
});

interface AdvertisementFormProps {
  type: 'item' | 'service';
  language: 'en' | 'ru';
  formState: {
    title: string;
    description: string;
    price: string;
    currency: string;
  };
  errors: {
    title: string;
    description: string;
    price: string;
  };
  onErrorChange: (name: string, value: string) => void;
  onFormStateChange: (name: string, value: string | number) => void;
}

const AdvertisementForm: React.FC<AdvertisementFormProps> = ({
  type,
  language,
  formState,
  errors,
  onFormStateChange,
  onErrorChange,
}) => {
  const t = createTranslationFunction(language);

  const MAX_TITLE_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 500;

  const getMaxPrice = (currency: string) => {
    switch (currency) {
      case 'RUB':
        return 100000;
      case 'USD':
      case 'EUR':
        return 1000;
      default:
        return 1000;
    }
  };

  const validatePrice = (value: string, currency = formState.currency) => {
    if (!/^\d*$/.test(value)) {
      onErrorChange('price', t('invalidPrice'));
      return false;
    }
    
    const cleanValue = value.replace(/\D/g, '');
    const numValue = parseInt(cleanValue, 10);
    const maxPrice = getMaxPrice(currency!!);
    
    if (isNaN(numValue)) {
      onErrorChange('price', t('invalidPrice'));
      return false;
    }
    
    if (numValue <= 0) {
      onErrorChange('price', t('priceMustBeGreaterThanZero'));
      return false;
    }

    if (numValue > maxPrice) {
      onErrorChange('price', t('priceExceedsLimit')
          .replace('{{max}}', maxPrice.toString())
          .replace('{{currency}}', currency!!)
      );
      return false;
    }
    
    onErrorChange('price', '');
    return true;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    
    if (name === 'currency') {
      if (formState.price) {
        if (validatePrice(formState.price, value)) {
          onFormStateChange(name, value);
        }
      } else {
        onFormStateChange(name, value);
      }
    } else if (name === 'price') {
      if (validatePrice(value, formState.currency)) {
        onFormStateChange(name, parseInt(value, 10));
      }
    } else if (name === 'title') {
      if (value.length <= MAX_TITLE_LENGTH) {
        onFormStateChange(name, value);
        onErrorChange('title', '');
      } else {
        onErrorChange('title', t('titleTooLong').replace('{{max}}', MAX_TITLE_LENGTH.toString()));
      }
    } else if (name === 'description') {
      if (value.length <= MAX_DESCRIPTION_LENGTH) {
        onFormStateChange(name, value);
        onErrorChange('description', '');
      } else {
        onErrorChange('description', t('descriptionTooLong').replace('{{max}}', MAX_DESCRIPTION_LENGTH.toString()));
      }
    } else {
      console.log("Unsupported field", name, value);
    }
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validatePrice(e.target.value);
  };

  const titleLabel = type === 'item' ? t('itemTitle') : t('serviceTitle');
  const descriptionLabel = type === 'item' ? t('itemDescription') : t('serviceDescription');
  const priceLabel = type === 'item' ? t('itemPrice') : t('servicePrice');

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <StyledTextField
        required
        name="title"
        label={titleLabel}
        value={formState.title}
        onChange={handleInputChange}
        error={!!errors.title}
        helperText={errors.title || `${formState.title.length}/${MAX_TITLE_LENGTH}`}
        fullWidth
      />
      <StyledTextField
        required
        name="description"
        label={descriptionLabel}
        multiline
        rows={4}
        value={formState.description}
        onChange={handleInputChange}
        error={!!errors.description}
        helperText={errors.description || `${formState.description.length}/${MAX_DESCRIPTION_LENGTH}`}
        fullWidth
      />
      <div className="flex gap-2">
        <StyledTextField
          required
          name="price"
          label={priceLabel}
          value={formState.price}
          onChange={handleInputChange}
          onBlur={handlePriceBlur}
          error={!!errors.price}
          helperText={errors.price}
          fullWidth
        />
        <StyledFormControl fullWidth>
          <InputLabel>{t('currency')}</InputLabel>
          <Select
            name="currency"
            value={formState.currency}
            onChange={handleInputChange}
            label={t('currency')}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="RUB">RUB</MenuItem>
          </Select>
        </StyledFormControl>
      </div>
    </div>
  );
};

export default AdvertisementForm; 