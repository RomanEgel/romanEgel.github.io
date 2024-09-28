import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Box, Button, Typography, styled } from '@mui/material';
import { createTranslationFunction } from './utils';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  language: 'en' | 'ru';
}

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};


const StyledBox = styled(Box)({
  backgroundColor: 'var(--bg-color)',
  padding: '16px',
  borderRadius: '8px',
});

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, language }) => {
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(2);
  const t = createTranslationFunction(language);

  const fetchUserLocation = async () => {
    try {
      const response = await fetch(`https://ipinfo.io/json?token=${import.meta.env.VITE_IPINFO_API_KEY}`);
      const data = await response.json();
      if (data.loc) {
        const [lat, lng] = data.loc.split(',').map(Number);
        setCenter({ lat, lng });
        setZoom(8);
      }
    } catch (error) {
      console.error('Error fetching user location:', error);
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setSelectedLocation(newLocation);
      onLocationSelect(newLocation.lat, newLocation.lng);
    }
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  useEffect(() => {
    if (map && selectedLocation) {
      map.panTo(selectedLocation);
      map.setZoom(14);
    }
  }, [map, selectedLocation]);

  return (
    <StyledBox>
      <Typography variant="h6" gutterBottom>{t('pickLocation')}</Typography>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
      <Box sx={{ mt: 2, mb: 2 }}>
        {selectedLocation ? (
          <Typography variant="body2">
            {t('selectedLocation')}: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </Typography>
        ) : (
          <Typography variant="body2">
            {t('clickMapToSelectLocation')}
          </Typography>
        )}
      </Box>
    </StyledBox>
  );
};

export default LocationPicker;