import { useTheme } from '../../context/ThemeContext';
import { useMemo } from 'react';

const colors = {
  dark: {
    land: '#3D2A7C',
    water: '#0e1626'
  },
  light: {
    land: '#AE99F6',
    water: '#ffffff'
  }
};

export const useMapOptions = () => {
  const { isDarkMode } = useTheme();

  const mapOptions = useMemo(
    () => ({
      styles: [
        {
          elementType: 'labels.text',
          stylers: [{ visibility: 'off' }]
        },
        {
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        },
        {
          elementType: 'geometry',
          stylers: [{ color: '#1d2c4d' }]
        },
        {
          featureType: 'administrative.country',
          elementType: 'geometry.stroke',
          stylers: [
            { color: '#4b6878' },
            { visibility: 'off' } // Turn off stroke lines
          ]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.fill',
          stylers: [
            { color: '#4b6878' },
            { visibility: 'off' } // Turn off stroke lines
          ]
        },
        {
          featureType: 'administrative.province',
          elementType: 'geometry.stroke',
          stylers: [
            { color: '#4b6878' },
            { visibility: 'off' } // Turn off stroke lines
          ]
        },
        {
          featureType: 'landscape.man_made',
          elementType: 'geometry.stroke',
          stylers: [
            { color: '#334e87' },
            { visibility: 'off' } // Turn off stroke lines for man-made landscape features
          ]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [
            { color: isDarkMode ? colors.light.land : colors.dark.land },
            { visibility: 'on' },
            { weight: 3 }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{ color: '#283d6a' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [{ color: '#023e58' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#304a7d' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#2c6675' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#255763' }]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry.fill',
          stylers: [{ color: '#283d6a' }]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [{ color: '#3a4762' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: isDarkMode ? colors.light.water : colors.dark.water }]
        }
      ],
      disableDefaultUI: true, // Disable all default UI
      zoomControl: false, // Disable zoom control
      mapTypeControl: false, // Disable map/satellite control
      scaleControl: false, // Disable scale control
      streetViewControl: false, // Disable street view control
      rotateControl: false, // Disable rotate control
      fullscreenControl: false, // Disable fullscreen control

      restriction: {
        latLngBounds: {
          north: 0, // Set to same value for no vertical movement
          south: 0, // Set to same value for no vertical movement
          east: 180,
          west: -180
        },
        strictBounds: false
      }
    }),
    [isDarkMode]
  );
  return mapOptions;
};
