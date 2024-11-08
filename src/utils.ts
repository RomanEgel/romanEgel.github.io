import { getTranslation, translations } from './localization';
import WebApp from '@twa-dev/sdk';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';

export const formatDate = (date: string, includeTime: boolean, language: 'en' | 'ru', includeSeconds: boolean = false) => {
  const format = includeTime
    ? (includeSeconds ? 'DD MMMM YYYY, HH:mm:ss' : 'DD MMMM YYYY, HH:mm')
    : 'DD MMMM YYYY';
  
  return dayjs(date).locale(language).format(format);
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

export const showConfirm = (message: string, callback: (result: boolean) => void) => {
  if (import.meta.env.MODE === 'development') {
    const result = window.confirm(message);
    callback(result);
  } else {
    WebApp.showConfirm(message, (result: boolean) => {
      callback(result);
    });
  }
};

export const uploadImageToGCS = async (link: string, image: File): Promise<boolean> => {
  try {
    const response = await fetch(link, {
      method: 'PUT',
      body: image,
      headers: {
        'Content-Type': 'image/jpg',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error uploading image:', error);
    return false;
  }
};