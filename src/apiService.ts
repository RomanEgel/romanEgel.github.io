import { API_BASE_URL } from './config';
import { LocalsEvent, LocalsNews, LocalsItem, LocalsService } from './types';

export const validateAuthorization = async (authorization: string) => {
  const response = await fetch(`${API_BASE_URL}/api/init`, {
    method: 'POST',
    headers: {
      Authorization: `tma ${authorization}`
    },
  });
  return response.json();
};

export const fetchItems = async (authorization: string, communityId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/items`, {
    headers: {
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    }
  });
  return response.json();
};

export const fetchServices = async (authorization: string, communityId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/services`, {
    headers: {
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    }
  });
  return response.json();
};

export const fetchEvents = async (authorization: string, communityId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    headers: {
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    }
  });
  return response.json();
};

export const fetchNews = async (authorization: string, communityId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/news`, {
    headers: {
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    }
  });
  return response.json();
};

export async function sendThemeParams(themeParams: any): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/theming`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(themeParams),
  });

  if (!response.ok) {
    throw new Error('Failed to send theme parameters');
  }
}

export async function deleteItem(itemId: string, authorization: string, communityId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    }
  });
  
}

export async function deleteService(serviceId: string, authorization: string, communityId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/services/${serviceId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    }
  });
  
}

export async function deleteEvent(eventId: string, authorization: string, communityId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    }
  });
  
}

export async function deleteNews(newsId: string, authorization: string, communityId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/news/${newsId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    }
  });
  
}

export async function updateItem(item: LocalsItem, authorization: string, communityId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/items/${item.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `tma ${authorization}`,
      'Content-Type': 'application/json',
      'X-Community-Id': communityId
    },
    body: JSON.stringify(item)
  });
  
}

export async function updateService(service: LocalsService, authorization: string, communityId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/services/${service.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `tma ${authorization}`,
      'Content-Type': 'application/json',
      'X-Community-Id': communityId
    },
    body: JSON.stringify(service)
  });
}

export async function updateEvent(event: LocalsEvent, authorization: string, communityId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/events/${event.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `tma ${authorization}`,
      'Content-Type': 'application/json',
      'X-Community-Id': communityId
    },
    body: JSON.stringify(event)
  });
}

export async function updateNews(news: LocalsNews, authorization: string, communityId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/news/${news.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `tma ${authorization}`,
      'Content-Type': 'application/json',
      'X-Community-Id': communityId
    },
    body: JSON.stringify(news)
  });
}

interface SetupData {
  language: string;
  location: {lat: number, lng: number};
  entitySettings: {
    eventHashtag: string;
    itemHashtag: string;
    serviceHashtag: string;
    newsHashtag: string;
  };
}

export const saveSetupData = async (setupData: SetupData, authorization: string, communityId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/community/_setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    },
    body: JSON.stringify(setupData)
  });
  if (!response.ok) {
    throw new Error('Failed to save setup data');
  }
};