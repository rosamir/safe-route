'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RouteOption } from '@/lib/api';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Component to automatically adjust map bounds to fit all routes
function ChangeView({ routes }: { routes: RouteOption[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (routes.length > 0) {
      const allCoords = routes.flatMap(r => r.coordinates);
      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [routes, map]);
  
  return null;
}

export default function MapDisplay({ routes, selectedRouteId }: { routes: RouteOption[], selectedRouteId: string | null }) {
  // Default center (Tel Aviv)
  const center: [number, number] = [32.0853, 34.7818];

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-2xl overflow-hidden">
      <MapContainer 
        center={center} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        <ChangeView routes={routes} />

        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const color = isSelected ? '#3b82f6' : '#94a3b8'; // blue-500 or slate-400
          const weight = isSelected ? 6 : 3;
          const opacity = isSelected ? 1 : 0.6;

          return (
            <Polyline 
              key={route.id} 
              positions={route.coordinates} 
              pathOptions={{ color, weight, opacity }}
            />
          );
        })}

        {/* Start and End Markers */}
        {routes.length > 0 && routes[0].coordinates.length > 0 && (
          <>
            <Marker position={routes[0].coordinates[0]} icon={icon}>
              <Popup>מוצא 📍</Popup>
            </Marker>
            <Marker position={routes[0].coordinates[routes[0].coordinates.length - 1]} icon={icon}>
              <Popup>יעד 🎯</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
      
      {/* Map Overlay Info */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
        מפת סיכונים בזמן אמת 🛡️
      </div>
    </div>
  );
}
