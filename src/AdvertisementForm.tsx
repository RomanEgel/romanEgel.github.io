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
import { createTranslationFunction } from './utils';
import { LocalsItem, LocalsService } from './types';

const StyledForm = styled('form')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
});

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
  onSubmit: (data: Partial<LocalsItem | LocalsService>) => void;
  language: 'en' | 'ru';
  categories: Array<{
    id: string;
    name: string;
  }>;
}

const getDefaultCurrency = (language: 'en' | 'ru'): string => {
  switch (language) {
    case 'ru':
      return 'RUB';
    case 'en':
    default:
      return 'USD';
  }
};

const AdvertisementForm: React.FC<AdvertisementFormProps> = ({
  type,
  onSubmit,
  language,
  categories,
}) => {
  const t = createTranslationFunction(language);
  const [formState, setFormState] = React.useState({
    title: '',
    description: '',
    price: '',
    currency: getDefaultCurrency(language),
    category: categories[0]?.id || '',
  });
  
  const [priceError, setPriceError] = React.useState<string>('');
  const [titleError, setTitleError] = React.useState<string>('');
  const [descriptionError, setDescriptionError] = React.useState<string>('');

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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    
    if (name === 'currency') {
      setFormState(prev => ({
        ...prev,
        currency: value,
      }));
      if (formState.price) {
        validatePrice(formState.price, value);
      }
    } else if (name === 'price') {
      if (value === '' || /^\d*$/.test(value)) {
        setFormState(prev => ({
          ...prev,
          price: value,
        }));
      }
    } else if (name === 'title') {
      if (value.length <= MAX_TITLE_LENGTH) {
        setFormState(prev => ({
          ...prev,
          title: value,
        }));
        setTitleError('');
      } else {
        setTitleError(t('titleTooLong').replace('{{max}}', MAX_TITLE_LENGTH.toString()));
      }
    } else if (name === 'description') {
      if (value.length <= MAX_DESCRIPTION_LENGTH) {
        setFormState(prev => ({
          ...prev,
          description: value,
        }));
        setDescriptionError('');
      } else {
        setDescriptionError(t('descriptionTooLong').replace('{{max}}', MAX_DESCRIPTION_LENGTH.toString()));
      }
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validatePrice = (value: string, currency = formState.currency) => {
    const cleanValue = value.replace(/\D/g, '');
    const numValue = parseInt(cleanValue, 10);
    const maxPrice = getMaxPrice(currency);
    
    if (isNaN(numValue)) {
      setPriceError(t('invalidPrice'));
      return false;
    }
    
    if (numValue <= 0) {
      setPriceError(t('priceMustBeGreaterThanZero'));
      return false;
    }

    if (numValue > maxPrice) {
      setPriceError(t('priceExceedsLimit')
        .replace('{{max}}', maxPrice.toString())
        .replace('{{currency}}', currency)
      );
      return false;
    }
    
    setFormState(prev => ({
      ...prev,
      price: numValue.toString(),
    }));
    setPriceError('');
    return true;
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validatePrice(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePrice(formState.price)) {
      onSubmit({
        ...formState,
        price: parseFloat(formState.price),
      });
    }
  };

  const titleLabel = type === 'item' ? t('itemTitle') : t('serviceTitle');
  const descriptionLabel = type === 'item' ? t('itemDescription') : t('serviceDescription');
  const priceLabel = type === 'item' ? t('itemPrice') : t('servicePrice');

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledTextField
        required
        name="title"
        label={titleLabel}
        value={formState.title}
        onChange={handleInputChange}
        error={!!titleError}
        helperText={titleError || `${formState.title.length}/${MAX_TITLE_LENGTH}`}
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
        error={!!descriptionError}
        helperText={descriptionError || `${formState.description.length}/${MAX_DESCRIPTION_LENGTH}`}
        fullWidth
      />
      <StyledFormControl fullWidth>
        <InputLabel>{t('category')}</InputLabel>
        <Select
          required
          name="category"
          value={formState.category}
          onChange={handleInputChange}
          label={t('category')}
        >
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
      <div className="flex gap-2">
        <StyledTextField
          required
          name="price"
          label={priceLabel}
          value={formState.price}
          onChange={handleInputChange}
          onBlur={handlePriceBlur}
          error={!!priceError}
          helperText={priceError}
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
    </StyledForm>
  );
};

export default AdvertisementForm; 