"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Polygon, InfoWindow, Marker } from "@react-google-maps/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import departamentosData from "@/data/el-salvador-departamentos.json";

interface ElSalvadorMapProps {
  height?: string;
  showInstructions?: boolean;
}

// Capital city coordinates (approximate centers of each departamento)
const capitalCoordinates: Record<string, { lat: number; lng: number }> = {
  "ahuachapan": { lat: 13.9203, lng: -89.8450 },
  "santa-ana": { lat: 14.0000, lng: -89.5500 },
  "sonsonate": { lat: 13.7200, lng: -89.7200 },
  "chalatenango": { lat: 14.0333, lng: -88.9333 },
  "la-libertad": { lat: 13.6769, lng: -89.2796 },
  "san-salvador": { lat: 13.6929, lng: -89.2182 },
  "cuscatlan": { lat: 13.7167, lng: -88.9333 },
  "la-paz": { lat: 13.5000, lng: -88.8667 },
  "cabanas": { lat: 13.8667, lng: -88.6333 },
  "san-vicente": { lat: 13.6333, lng: -88.8000 },
  "usulutan": { lat: 13.3500, lng: -88.4500 },
  "san-miguel": { lat: 13.4833, lng: -88.1833 },
  "morazan": { lat: 13.7000, lng: -88.1000 },
  "la-union": { lat: 13.3367, lng: -87.8439 },
};

const departamentos = [
  { id: "ahuachapan", name: "Ahuachapán", code: "AH", capital: "Ahuachapán", color: "#FFD700" },
  { id: "santa-ana", name: "Santa Ana", code: "SA", capital: "Santa Ana", color: "#FF69B4" },
  { id: "sonsonate", name: "Sonsonate", code: "SO", capital: "Sonsonate", color: "#4169E1" },
  { id: "chalatenango", name: "Chalatenango", code: "CH", capital: "Chalatenango", color: "#9370DB" },
  { id: "la-libertad", name: "La Libertad", code: "LI", capital: "Santa Tecla", color: "#90EE90" },
  { id: "san-salvador", name: "San Salvador", code: "SS", capital: "San Salvador", color: "#FFA500" },
  { id: "cuscatlan", name: "Cuscatlán", code: "CU", capital: "Cojutepeque", color: "#FF4500" },
  { id: "la-paz", name: "La Paz", code: "PA", capital: "Zacatecoluca", color: "#1E90FF" },
  { id: "cabanas", name: "Cabañas", code: "CA", capital: "Sensuntepeque", color: "#32CD32" },
  { id: "san-vicente", name: "San Vicente", code: "SV", capital: "San Vicente", color: "#BA55D3" },
  { id: "usulutan", name: "Usulután", code: "US", capital: "Usulután", color: "#FFB6C1" },
  { id: "san-miguel", name: "San Miguel", code: "SM", capital: "San Miguel", color: "#FF8C00" },
  { id: "morazan", name: "Morazán", code: "MO", capital: "San Francisco Gotera", color: "#87CEEB" },
  { id: "la-union", name: "La Unión", code: "UN", capital: "La Unión", color: "#228B22" },
];

// Default center of El Salvador
const defaultCenter = {
  lat: 13.7942,
  lng: -88.8965,
};

// Default map options
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    // Hide POI labels
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    // De-emphasize water outside the region
    {
      featureType: "water",
      stylers: [
        { color: "#e0e0e0" },
        { saturation: -50 },
        { lightness: 20 },
      ],
    },
    // De-emphasize land/administrative areas outside El Salvador
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#cccccc" },
        { weight: 0.5 },
        { visibility: "simplified" },
      ],
    },
    // Make roads less prominent outside the focus area
    {
      featureType: "road",
      stylers: [
        { saturation: -70 },
        { lightness: 40 },
        { visibility: "simplified" },
      ],
    },
    // De-emphasize labels outside the region
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [
        { saturation: -80 },
        { lightness: 50 },
        { visibility: "simplified" },
      ],
    },
    // Make the overall map less saturated to make El Salvador stand out
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [
        { saturation: -30 },
        { lightness: 10 },
      ],
    },
  ],
};

// Type declarations for Google Maps
declare global {
  namespace google {
    namespace maps {
      interface Map {}
      interface LatLng {
        lat(): number;
        lng(): number;
      }
      interface MapMouseEvent {
        latLng: LatLng | null;
      }
    }
  }
}

export default function ElSalvadorMap({ 
  height = "100%", 
  showInstructions = true 
}: ElSalvadorMapProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isSubscribed } = useSubscription();
  const [hoveredDepartamento, setHoveredDepartamento] = useState<string | null>(null);
  const [clickedDepartamento, setClickedDepartamento] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['geometry', 'drawing'],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map | null) => {
    setMap(map);
  }, []);

  // Convert GeoJSON coordinates to Google Maps LatLng format
  const getPolygonPaths = (coordinates: number[][][]): google.maps.LatLngLiteral[] => {
    // GeoJSON coordinates are [lng, lat], Google Maps uses [lat, lng]
    return coordinates[0].map((coord) => ({
      lat: coord[1],
      lng: coord[0],
    }));
  };

  // Get departamento data from GeoJSON
  const getDepartamentoFromGeoJSON = (departamentoId: string) => {
    const feature = departamentosData.features.find(
      (f) => f.properties.id === departamentoId
    );
    if (feature && feature.geometry.type === "Polygon") {
      return getPolygonPaths(feature.geometry.coordinates);
    }
    return [];
  };


  const handleDepartamentoClick = (departamentoId: string, event: google.maps.MapMouseEvent | null) => {
    setClickedDepartamento(departamentoId);
    if (event?.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setInfoWindowPosition({ lat, lng });
    }
    setTimeout(() => {
      router.push(`/departamento/${departamentoId}`);
    }, 150);
  };

  const handleMouseEnter = (departamentoId: string) => {
    setHoveredDepartamento(departamentoId);
  };

  const handleMouseLeave = () => {
    if (clickedDepartamento === null) {
      setHoveredDepartamento(null);
      setInfoWindowPosition(null);
    }
  };

  const getDepartamentoStyle = (departamentoId: string): google.maps.PolygonOptions => {
    const dept = departamentos.find(d => d.id === departamentoId);
    const isHovered = hoveredDepartamento === departamentoId;
    const isClicked = clickedDepartamento === departamentoId;
    
    if (isClicked) {
      return {
        fillColor: dept?.color || "#1e40af",
        fillOpacity: 0.95,
        strokeColor: "#000000",
        strokeWeight: 5,
        strokeOpacity: 1,
      };
    }
    
    if (isHovered) {
      return {
        fillColor: dept?.color || "#3b82f6",
        fillOpacity: 0.9,
        strokeColor: "#000000",
        strokeWeight: 4,
        strokeOpacity: 1,
      };
    }
    
    return {
      fillColor: dept?.color || "#60a5fa",
      fillOpacity: 0.85,
      strokeColor: "#000000",
      strokeWeight: 3,
      strokeOpacity: 1,
    };
  };

  if (!mounted) {
    return (
      <div className="w-full flex items-center justify-center bg-white" style={{ height }}>
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="w-full flex items-center justify-center bg-white" style={{ height }}>
        <div className="text-center p-8">
          <div className="text-red-600 font-semibold mb-2">Google Maps API Key Required</div>
          <div className="text-gray-600 text-sm">
            Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full flex items-center justify-center bg-white" style={{ height }}>
        <div className="text-center p-8">
          <div className="text-red-600 font-semibold mb-2">Error loading Google Maps</div>
          <div className="text-gray-600 text-sm">
            {loadError.message || "Please check your API key and ensure Maps JavaScript API is enabled"}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full flex items-center justify-center bg-white" style={{ height }}>
        <div className="text-gray-600">Loading Google Maps...</div>
      </div>
    );
  }

  const hoveredDept = hoveredDepartamento 
    ? departamentos.find(d => d.id === hoveredDepartamento) 
    : null;

  return (
    <div className="w-full relative bg-white" style={{ height }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={8}
        options={defaultOptions}
        onLoad={onMapLoad}
      >
        {/* Render all 14 departamentos from GeoJSON data */}
        {departamentosData.features.map((feature) => {
          const departamentoId = feature.properties.id;
          const paths = getDepartamentoFromGeoJSON(departamentoId);
          
          if (paths.length === 0) return null;

          return (
            <Polygon
              key={departamentoId}
              paths={paths}
              options={getDepartamentoStyle(departamentoId)}
              onMouseOver={() => handleMouseEnter(departamentoId)}
              onMouseOut={handleMouseLeave}
              onClick={(e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                  handleDepartamentoClick(departamentoId, e);
                }
              }}
            />
          );
        })}

        {/* Add a white outer border (halo effect) around each departamento for better visibility */}
        {departamentosData.features.map((feature) => {
          const departamentoId = feature.properties.id;
          const paths = getDepartamentoFromGeoJSON(departamentoId);
          
          if (paths.length === 0) return null;

          return (
            <Polygon
              key={`outer-border-${departamentoId}`}
              paths={paths}
              options={{
                fillColor: "transparent",
                fillOpacity: 0,
                strokeColor: "#ffffff",
                strokeWeight: 6,
                strokeOpacity: 0.9,
              }}
            />
          );
        })}

        {/* Add a prominent black border around each departamento */}
        {departamentosData.features.map((feature) => {
          const departamentoId = feature.properties.id;
          const paths = getDepartamentoFromGeoJSON(departamentoId);
          
          if (paths.length === 0) return null;

          return (
            <Polygon
              key={`border-${departamentoId}`}
              paths={paths}
              options={{
                fillColor: "transparent",
                fillOpacity: 0,
                strokeColor: "#000000",
                strokeWeight: 4,
                strokeOpacity: 1,
              }}
            />
          );
        })}

        {/* Add markers (pins) for each departamento capital */}
        {departamentos.map((dept) => {
          const coords = capitalCoordinates[dept.id];
          if (!coords) return null;

          const isSelected = selectedMarker === dept.id;
          const isHovered = hoveredDepartamento === dept.id;

          // Create custom marker icon with departamento color
          const markerIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isSelected ? 12 : isHovered ? 10 : 8,
            fillColor: dept.color,
            fillOpacity: 1,
            strokeColor: "#000000",
            strokeWeight: isSelected ? 3 : 2,
          };

          return (
            <Marker
              key={`marker-${dept.id}`}
              position={coords}
              icon={markerIcon}
              onClick={() => {
                setSelectedMarker(dept.id);
                setInfoWindowPosition(coords);
                setTimeout(() => {
                  if (!isAuthenticated) {
                    // Store the intended destination
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("redirectAfterLogin", `/departamento/${dept.id}`);
                    }
                    router.push("/login");
                    return;
                  }

                  if (!isSubscribed) {
                    // Store the intended destination
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("redirectAfterSubscription", `/departamento/${dept.id}`);
                    }
                    router.push("/subscription");
                    return;
                  }

                  // User is authenticated and subscribed, proceed to departamento page
                  router.push(`/departamento/${dept.id}`);
                }, 150);
              }}
            />
          );
        })}

        {/* InfoWindow for hovered departamento */}
        {infoWindowPosition && hoveredDept && !selectedMarker && (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={() => {
              setInfoWindowPosition(null);
            }}
          >
            <div className="p-2">
              <div className="font-bold text-lg">{hoveredDept.name}</div>
              <div className="text-sm text-gray-600">Capital: {hoveredDept.capital}</div>
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for selected marker */}
        {infoWindowPosition && selectedMarker && (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={() => {
              setInfoWindowPosition(null);
              setSelectedMarker(null);
            }}
          >
            <div className="p-2">
              <div className="font-bold text-lg">
                {departamentos.find(d => d.id === selectedMarker)?.name}
              </div>
              <div className="text-sm text-gray-600">
                Capital: {departamentos.find(d => d.id === selectedMarker)?.capital}
        </div>
      </div>
          </InfoWindow>
        )}
        {infoWindowPosition && hoveredDept && (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={() => {
              setInfoWindowPosition(null);
            }}
          >
            <div className="p-2">
              <div className="font-bold text-lg">{hoveredDept.name}</div>
              <div className="text-sm text-gray-600">Capital: {hoveredDept.capital}</div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Map Instructions Overlay */}
      {showInstructions && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 max-w-xs border border-gray-200">
          <h3 className="font-bold text-lg mb-2 text-gray-900">El Salvador</h3>
          <p className="text-sm text-gray-600 mb-2">
            Click on any departamento to explore
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Hover to see names</p>
            <p>• Click regions or pins to navigate</p>
            <p>• 14 Departamentos with pins</p>
          </div>
          {hoveredDept && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900">
                {hoveredDept.name}
              </p>
              <p className="text-xs text-gray-600">
                Capital: {hoveredDept.capital}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Clickable indicator */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="font-medium">Clickable regions</span>
        </div>
      </div>
    </div>
  );
}
