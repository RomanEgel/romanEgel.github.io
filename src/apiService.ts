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

export async function getLinkToUserProfile(userId: string, authorization: string, communityId: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/_resolve-link`, {
    headers: {
      Authorization: `tma ${authorization}`,
      'X-Community-Id': communityId
    }
  });
  return (await response.json())['link'];
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

interface CommunityCoordinates {
  lat: number;
  lng: number;
}

export const fetchCommunityCoordinates = async (authorization: string): Promise<CommunityCoordinates[]> => {
  const response = await fetch(`${API_BASE_URL}/api/communities/coordinates`, {
    headers: {
      Authorization: `tma ${authorization}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch community coordinates');
  }
  return (await response.json())['coordinates'];
};

export const createMediaGroup = async (images: string[], authorization: string) => {
  const response = await fetch(`${API_BASE_URL}/api/media-groups`, {
    method: 'POST',
    headers: {
      Authorization: `tma ${authorization}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ images }),
  });
  return response.json();
};

export const createAdvertisement = async (mediaGroupId: string, title: string, description: string, price: number, currency: string, entityType: 'item' | 'service', location: {lat: number, lng: number}, range: number, authorization: string) => {
  const response = await fetch(`${API_BASE_URL}/api/advertisements`, {
    method: 'POST',
    headers: {
      Authorization: `tma ${authorization}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      price,
      currency,
      entityType,
      location,
      range,
      mediaGroupId
    })
  });
  return response;
};