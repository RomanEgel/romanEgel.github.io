import React from 'react';
import WebApp from '@twa-dev/sdk';
import { X, MessageCircle, UserCircle } from 'lucide-react';
import { ListItem } from './types';
import { formatDate, formatPrice, createTranslationFunction } from './utils';

interface CardDetailViewProps {
  item: ListItem;
  onClose: () => void;
  communityLanguage: 'en' | 'ru';
}

const CardDetailView: React.FC<CardDetailViewProps> = ({ item, onClose, communityLanguage }) => {
  const t = createTranslationFunction(communityLanguage);

  const openTelegramLink = (url: string) => {
    WebApp.openTelegramLink(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white app-body">
      <header className="app-header sticky top-0 z-10 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold truncate">{item.title}</h2>
          <button onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto">
        <div className="p-4">
          <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded-lg mb-4" />
          
          {'price' in item && 'currency' in item && (
            <p className="font-bold app-price text-lg mb-2">
              {formatPrice(item.price, item.currency, communityLanguage)}
            </p>
          )}
          
          {'date' in item && (
            <p className="font-bold app-event-date text-lg mb-2">
              {formatDate(item.date, true, communityLanguage)}
            </p>
          )}

          <p className="mb-4 app-text">{item.description}</p>

          <div className="flex items-center justify-between mb-4">
            <p className="app-author-text">
              {t('postedBy')} <span className="app-author">{item.author}</span>
            </p>
            <p className="app-publication-date">
              {formatDate(item.publishedAt, false, communityLanguage)}
            </p>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 p-4 bg-white border-t app-footer">
        <div className="flex space-x-4">
          <button
            onClick={() => openTelegramLink(`https://t.me/c/${item.communityId.toString().slice(4)}/${item.messageId}`)}
            className="flex-1 py-2 px-4 rounded-lg app-button"
          >
            <MessageCircle className="h-5 w-5 inline-block mr-2" />
            {t('viewInChat')}
          </button>
          <button
            onClick={() => openTelegramLink(`https://t.me/${item.username}`)}
            className="flex-1 py-2 px-4 rounded-lg app-button"
          >
            <UserCircle className="h-5 w-5 inline-block mr-2" />
            {t('contactAuthor')}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CardDetailView;