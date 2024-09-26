import { API_BASE_URL } from './config';

export const validateAuthorization = async (authorization: string) => {
  const response = await fetch(`${API_BASE_URL}/api/init`, {
    method: 'POST',
    headers: {
      Authorization: `tma ${authorization}`
    },
  });
  return response.json();
};

export const fetchItems = async (authorization: string) => {
  const response = await fetch(`${API_BASE_URL}/api/items`, {
    headers: {
      Authorization: `tma ${authorization}`
    }
  });
  return response.json();
};

export const fetchServices = async (authorization: string) => {
  const response = await fetch(`${API_BASE_URL}/api/services`, {
    headers: {
      Authorization: `tma ${authorization}`
    }
  });
  return response.json();
};

export const fetchEvents = async (authorization: string) => {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    headers: {
      Authorization: `tma ${authorization}`
    }
  });
  return response.json();
};

export const fetchNews = async (authorization: string) => {
  const response = await fetch(`${API_BASE_URL}/api/news`, {
    headers: {
      Authorization: `tma ${authorization}`
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