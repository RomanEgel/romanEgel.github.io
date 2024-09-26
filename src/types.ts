export type ListItem = LocalsItem | LocalsService | LocalsEvent | LocalsNews;

interface BaseItem {
  id: string;
  title: string;
  image: string;
  author: string;
  username: string;
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