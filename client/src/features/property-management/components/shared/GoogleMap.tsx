
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface GoogleMapProps {
  address: string;
  zipCode: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  address,
  zipCode,
  onLocationSelect,
  className = ""
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      // Create script tag to load Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBokTWbCWqDFLUbCWQxiWN6yIFjYCzYXnA'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        setError('Failed to load Google Maps');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      try {
        const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City default
        
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 15,
          center: defaultCenter,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        setMap(mapInstance);

        // Search for the address if provided
        if (address && zipCode) {
          const geocoder = new window.google.maps.Geocoder();
          const searchQuery = `${address}, ${zipCode}`;
          
          geocoder.geocode({ address: searchQuery }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              mapInstance.setCenter(location);
              
              // Create or update marker
              if (marker) {
                marker.setMap(null);
              }
              
              const newMarker = new window.google.maps.Marker({
                position: location,
                map: mapInstance,
                title: address,
                animation: window.google.maps.Animation.DROP
              });
              
              setMarker(newMarker);
              
              if (onLocationSelect) {
                onLocationSelect({
                  lat: location.lat(),
                  lng: location.lng(),
                  address: results[0].formatted_address
                });
              }
            }
          });
        }

        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, [address, zipCode, onLocationSelect]);

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">Unable to load map: {error}</p>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full min-h-[300px]"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default GoogleMap;
