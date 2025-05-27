import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

function LocationPicker({ value, onChange }) {
  const position = value ? [value.lat, value.lng] : [16.047079, 108.206230]; // Default to Da Nang

  useEffect(() => {
    // Add CSS to ensure the map container has a height
    const style = document.createElement('style');
    style.textContent = `.leaflet-container { height: 400px; width: 100%; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {value && <Marker position={[value.lat, value.lng]} />}
      <MapEvents onLocationSelect={onChange} />
    </MapContainer>
  );
}

export default LocationPicker;