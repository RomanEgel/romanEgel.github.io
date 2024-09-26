import { getTranslation, translations } from './localization';

export const formatDate = (dateString: string, isEventDate: boolean = false, language: 'en' | 'ru') => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(isEventDate ? { timeZone: 'UTC' } : {})
  };
  
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';
  return new Intl.DateTimeFormat(locale, options).format(new Date(dateString));
};

export const formatPrice = (price: number | null | undefined, currency: string | null | undefined, language: 'en' | 'ru') => {
  const t = createTranslationFunction(language);

  if (price === null || price === undefined) {
    return t('uponRequest');
  }
  if (price === 0) {
    return t('free');
  }
  if (currency === null || currency === undefined) {
    return `${price}`;
  }
  if (currency === 'USD') {
    return `$${price.toFixed(2)}`;
  } else if (currency === 'RUB') {
    return `${Math.round(price)} ₽`;
  }
  return `${price} ${currency}`;
};

export const createTranslationFunction = (language: 'en' | 'ru') => {
  return (key: keyof typeof translations.en) => getTranslation(key, language);
};