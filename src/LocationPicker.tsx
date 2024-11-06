import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { Box, Typography, styled } from '@mui/material';
import { createTranslationFunction } from './utils';

interface MapPin {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  location: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
  language: 'en' | 'ru';
  pins?: MapPin[];
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

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, language, pins = [], location }) => {
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
    if (!selectedLocation) {
      fetchUserLocation();
    }
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
    if (location) {
      setSelectedLocation({ lat: location.lat, lng: location.lng });
      if (map) {
        map.panTo({ lat: location.lat, lng: location.lng });
        map.setZoom(14);
      }
    } else {
      setSelectedLocation(null);
    }
  }, [location, map]);

  const getIconSize = (zoomLevel: number) => {
    const baseSize = 32;
    const scaleFactor = 1.2;
    
    const size = Math.max(16, Math.min(48, baseSize * Math.pow(scaleFactor, zoomLevel - 14)));
    
    return {
      url: '/icon.png',
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size/2),
    };
  };

  const handleZoomChanged = () => {
    if (map) {
      const newZoom = map.getZoom();
      if (newZoom) {
        setZoom(newZoom);
      }
    }
  };

  useEffect(() => {
    if (map && selectedLocation) {
      // Clear existing markers
      if (window.google) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: selectedLocation,
          title: 'Selected Location'
        });

        return () => {
          marker.map = null;
        };
      }
    }
  }, [map, selectedLocation]);

  useEffect(() => {
    if (map && pins.length > 0 && window.google) {
      const markers = pins.map((pin, index) => {
        const pinElement = document.createElement('div');
        pinElement.style.width = `${getIconSize(zoom).scaledSize.width}px`;
        pinElement.style.height = `${getIconSize(zoom).scaledSize.height}px`;
        pinElement.style.backgroundImage = `url(${getIconSize(zoom).url})`;
        pinElement.style.backgroundSize = 'contain';

        return new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: pin.lat, lng: pin.lng },
          title: t('localsOnlyCommunity'),
          content: pinElement
        });
      });

      return () => {
        markers.forEach(marker => {
          marker.map = null;
        });
      };
    }
  }, [map, pins, zoom]);

  return (
    <StyledBox>
      <Typography variant="h6" gutterBottom>{t('pickLocation')}</Typography>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onClick={handleMapClick}
        onLoad={onMapLoad}
        onZoomChanged={handleZoomChanged}
        options={{
          mapId: import.meta.env.VITE_GOOGLE_MAPS_ID as string
        }}
      >
        {/* Remove the MarkerF components - markers are now handled in useEffect */}
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