import React from 'react';
import { useLoadScript } from '@react-google-maps/api';

interface GoogleMapsProviderProps {
  children: React.ReactNode;
  language: 'en' | 'ru';
}

const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children, language }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    language: language,
    libraries: ['places'],
    version: 'weekly',
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return <>{children}</>;
};

export default GoogleMapsProvider;