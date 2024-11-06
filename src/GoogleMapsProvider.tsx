import React from 'react';
import { useLoadScript } from '@react-google-maps/api';

// Define libraries array as a static constant outside the component
const libraries: ("places" | "marker")[] = ['places', 'marker'];

interface GoogleMapsProviderProps {
  children: React.ReactNode;
  language: 'en' | 'ru';
}

const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children, language }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    language: language,
    libraries: libraries, // Use the static libraries array
    version: 'weekly',
    mapIds: [import.meta.env.VITE_GOOGLE_MAPS_ID as string], // Add Map ID here
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