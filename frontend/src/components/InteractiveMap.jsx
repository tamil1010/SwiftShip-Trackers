import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Coordinates database for Indian cities
const CITY_COORDS = {
  Chennai: [13.0827, 80.2707],
  Coimbatore: [11.0168, 76.9558],
  Tirunelveli: [8.7139, 77.7567],
  Madurai: [9.9252, 78.1198],
  Salem: [11.6643, 78.146],
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
};

const InteractiveMap = ({ originCity = 'Tirunelveli', currentCity = 'Coimbatore', destinationCity = 'Chennai' }) => {
  const origin = CITY_COORDS[originCity] || CITY_COORDS['Tirunelveli'];
  const destination = CITY_COORDS[destinationCity] || CITY_COORDS['Chennai'];
  const current = CITY_COORDS[currentCity] || origin;

  const positions = [origin, current, destination];
  const center = current || origin;

  return (
    <div className="w-full h-72 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
      <MapContainer center={center} zoom={6} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Origin Marker */}
        <Marker position={origin}>
          <Popup>
            <div className="p-1">
              <strong className="text-sky-700">Origin: {originCity}</strong>
              <p className="text-xs text-slate-600">Shipment Picked Up</p>
            </div>
          </Popup>
        </Marker>

        {/* Current Location Marker */}
        {currentCity !== originCity && currentCity !== destinationCity && (
          <Marker position={current}>
            <Popup>
              <div className="p-1">
                <strong className="text-amber-600">Current: {currentCity}</strong>
                <p className="text-xs text-slate-600">Live In-Transit Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        <Marker position={destination}>
          <Popup>
            <div className="p-1">
              <strong className="text-emerald-700">Destination: {destinationCity}</strong>
              <p className="text-xs text-slate-600">Final Delivery Point</p>
            </div>
          </Popup>
        </Marker>

        {/* Route Line */}
        <Polyline positions={positions} color="#0284c7" weight={4} dashArray="8, 8" />
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
