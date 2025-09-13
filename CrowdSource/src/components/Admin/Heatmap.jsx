import React, { useMemo, useState, useRef } from "react";
import { GoogleMap, LoadScript, HeatmapLayer, Marker } from "@react-google-maps/api";
import issues from "../../data/issues.js";

const containerStyle = { width: "600px", height: "600px" };
const indiaCenter = { lat: 20.5937, lng: 78.9629 };

export default function User() {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(5);
  const mapRef = useRef(null);
  const heatmapRef = useRef(null);

  const heatmapData = useMemo(() => {
    if (!mapLoaded || !window.google) return [];
    return issues.map((issue) => new window.google.maps.LatLng(issue.lat, issue.lng));
  }, [mapLoaded]);

  const handleZoomChanged = () => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    setZoom(currentZoom);

    // Manually remove heatmap when zoom >= 11
    if (currentZoom >= 11 && heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }
    // Optionally show heatmap again when zoom < 11
    if (currentZoom < 11 && heatmapRef.current) {
      heatmapRef.current.setMap(mapRef.current);
    }
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["visualization"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={indiaCenter}
        zoom={zoom}
        onLoad={(map) => {
          mapRef.current = map;
          setMapLoaded(true);
        }}
        onZoomChanged={handleZoomChanged}
      >
        {mapLoaded && (
          <HeatmapLayer
            onLoad={(heatmap) => {
              heatmapRef.current = heatmap;
              heatmap.setMap(mapRef.current);
            }}
            data={heatmapData}
            options={{
              radius: 40,
              opacity: 0.7,
              dissipating: true,
            }}
          />
        )}

        {mapLoaded &&
          zoom >= 11 &&
          issues.map((issue) => (
            <Marker
              key={issue.id}
              position={{ lat: issue.lat, lng: issue.lng }}
              title={issue.title}
            />
          ))}
      </GoogleMap>
    </LoadScript>
  );
}