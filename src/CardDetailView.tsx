import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { MessageCircle, UserCircle, Trash2, Pencil, Save, X } from 'lucide-react';
import { ListItem } from './types';
import { formatDate, formatPrice, createTranslationFunction, showConfirm } from './utils';

interface CardDetailViewProps {
  item: ListItem;
  active_tab: string;
  onClose: () => void;
  communityLanguage: 'en' | 'ru';
  isCurrentUserAuthor: boolean; // New prop
  onDelete?: (item_id: string, active_tab: string) => void; // New prop for delete functionality
  onEdit?: (item: ListItem, active_tab: string) => void; // New prop for edit functionality
}

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({ ...prev, [name]: value }));
  };

  // Add this new function to handle numeric input for price
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setEditedItem(prev => ({ ...prev, price: value }));
    }
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
          {isCurrentUserAuthor && !isEditing && (
            <button
              onClick={handleEdit}
              className="absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full app-button-edit"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="p-4">
          {isEditing ? (
            <>
              <input
                type="text"
                name="title"
                value={editedItem.title}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 app-input"
              />
              {'price' in editedItem && 'currency' in editedItem && (
                <div className="flex mb-4">
                  <input
                    type="text"
                    name="price"
                    value={editedItem.price}
                    onChange={handlePriceChange}
                    className="flex-grow p-2 app-input"
                    placeholder={t('price')}
                  />
                  <select
                    name="currency"
                    value={editedItem.currency}
                    onChange={handleInputChange}
                    className="ml-2 p-2 app-input"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                  </select>
                </div>
              )}
              <textarea
                name="description"
                value={editedItem.description}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 app-input"
                rows={4}
              />
            </>
          ) : (
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

      <nav className="app-bottom-bar">
        <div className="flex justify-around">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex-1 py-4 app-button app-button-cancel"
              >
                <X className="h-5 w-5 inline-block mr-2" />
                <span>{t('cancel')}</span>
              </button>
              <div className="w-0.5"/>
              <button
                onClick={handleSave}
                className="flex-1 py-4 app-button app-button-save"
              >
                <Save className="h-5 w-5 inline-block mr-2" />
                <span>{t('save')}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openTelegramLink(messageLink)}
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
                  onClick={() => openTelegramLink(contactAuthorLink)}
                  className="flex-1 py-4 app-button"
                >
                  <UserCircle className="h-5 w-5 inline-block mr-2" />
                  <span>{t('contactAuthor')}</span>
                </button>
              )}
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default CardDetailView;