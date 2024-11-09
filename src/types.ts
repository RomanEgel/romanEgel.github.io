export type ListItem = LocalsItem | LocalsService | LocalsEvent | LocalsNews;

interface BaseItem {
  id: string;
  title: string;
  images: string[];
  author: string;
  userId: string;
  publishedAt: string;
  category: string;
  description: string;
  communityId: number;
  messageId: number;
}

export interface LocalsItem extends BaseItem {
  price: number;
  currency: string;
}

export interface LocalsService extends BaseItem {
  price: number;
  currency: string;
}

export interface LocalsEvent extends BaseItem {
  date: string;
}

export interface LocalsNews extends BaseItem {}

export interface LocalsCommunity {
  id: string;
  chatId: number;
  name: string;
  status: 'SETUP' | 'READY';
  language: 'en' | 'ru';
  entitySettings: {
    eventHashtag: string;
    itemHashtag: string;
    serviceHashtag: string;
    newsHashtag: string;
  };
}

export interface LocalsUser {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  notifications_enabled: boolean;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  entityType: string;
  views: number;
  images: string[];
}
