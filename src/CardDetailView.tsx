import React, { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { MessageCircle, UserCircle, Trash2 } from 'lucide-react';
import { ListItem } from './types';
import { formatDate, formatPrice, createTranslationFunction, showConfirm } from './utils';

interface CardDetailViewProps {
  item: ListItem;
  active_tab: string;
  onClose: () => void;
  communityLanguage: 'en' | 'ru';
  isCurrentUserAuthor: boolean; // New prop
  onDelete?: (item_id: string, item_type: string) => void; // New prop for delete functionality
}

const CardDetailView: React.FC<CardDetailViewProps> = ({ 
  item, 
  active_tab,
  onClose, 
  communityLanguage, 
  isCurrentUserAuthor,
  onDelete
}) => {
  const t = createTranslationFunction(communityLanguage);

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

  return (
    <div className="flex-grow flex flex-col app-container">
      <div className="flex-grow overflow-y-auto app-card-detail-content">
        <div className="w-full h-64 md:h-80 lg:h-96 relative app-image-container">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="p-4">
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
        </div>
      </div>

      <nav className="app-bottom-bar">
        <div className="flex justify-around">
          <button
            onClick={() => openTelegramLink(`https://t.me/c/${item.communityId.toString().slice(4)}/${item.messageId}`)}
            className="flex-1 py-4 app-button"
          >
            <MessageCircle className="h-5 w-5 inline-block mr-2" />
            <span>{t('viewInChat')}</span>
          </button>
          <div className="w-0.5"/>
          {isCurrentUserAuthor ? (
            <button
              onClick={handleDelete}
              className="flex-1 py-4 app-button app-button-delete"
            >
              <Trash2 className="h-5 w-5 inline-block mr-2" />
              <span>{t('delete')}</span>
            </button>
          ) : (
            <button
              onClick={() => openTelegramLink(`https://t.me/${item.username}`)}
              className="flex-1 py-4 app-button"
            >
              <UserCircle className="h-5 w-5 inline-block mr-2" />
              <span>{t('contactAuthor')}</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default CardDetailView;