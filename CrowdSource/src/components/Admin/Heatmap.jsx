import React, { useState, useEffect } from "react";
import { GoogleMap, Circle, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import issues from "../data/issues.js";
import indiaGeoJson from "../data/india.json";
import '@fortawesome/fontawesome-free/css/all.min.css';

const containerStyle = { width: "500px", height: "500px" };
const indiaCenter = { lat: 20.5937, lng: 78.9629 };

const circleOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 1,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  zIndex: 1,
};

function getCircleRadius(zoom) {
  const baseRadius = 60000;
  const scale = Math.pow(2, 7 - zoom);
  return baseRadius * scale;
}

function pointInPolygon(point, polygon) {
  const [x, y] = [point.lng, point.lat];
  let inside = false;
  const polygons = polygon.type === "Polygon" ? [polygon.coordinates] : polygon.coordinates;

  for (let poly of polygons) {
    for (let ring of poly) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0], yi = ring[i][1];
        const xj = ring[j][0], yj = ring[j][1];
        const intersect =
          (yi > y) !== (yj > y) &&
          x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
    }
  }
  return inside;
}

function getColor(ratio, count) {
  if (count === 0) return "#e0f0ff";
  if (ratio < 0.25) return rgb(${Math.round(0 + 128 * (ratio / 0.25))},0,255);
  if (ratio < 0.5) return rgb(128,0,${Math.round(255 - 55 * ((ratio - 0.25) / 0.25))});
  if (ratio < 0.75) {
    const t = (ratio - 0.5) / 0.25;
    return rgb(${Math.round(128 + 127 * t)},${Math.round(128 * t)},${200 - Math.round(200 * t)});
  }
  const t = (ratio - 0.75) / 0.25;
  return rgb(255,${Math.round(128 - 128 * t)},0);
}

export default function User() {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [formData, setFormData] = useState({
    issue: "",
    priority: ["low", "medium", "high", "critical"],
    picture: "",
    location: indiaCenter,
  });

  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(5);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setFormData((prev) => ({
          ...prev,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        })),
      (err) => setError(err.message)
    );
  }, []);

  const stateIssueCounts = indiaGeoJson.features.map((state) => {
    const stateName = state.properties.STNAME;
    let count = 0;
    issues.forEach((issue) => {
      if (pointInPolygon({ lat: issue.lat, lng: issue.lng }, state.geometry)) count++;
    });
    return { name: stateName, count };
  });

  const maxStateCount = Math.max(...stateIssueCounts.map((s) => s.count)) || 1;

  useEffect(() => {
    if (!map) return;

    map.data.forEach((f) => map.data.remove(f));

    if (zoom < 7) {
      map.data.addGeoJson(indiaGeoJson);

      map.data.setStyle((feature) => {
        const stateName = feature.getProperty("STNAME");
        const stateData = stateIssueCounts.find((s) => s.name === stateName);
        const count = stateData ? stateData.count : 0;
        const ratio = count / maxStateCount;

        return {
          fillColor: getColor(ratio, count),
          fillOpacity: 0.5,
          strokeColor: "#222",
          strokeOpacity: 0.3,
          strokeWeight: 1,
        };
      });
    }
  }, [map, zoom, stateIssueCounts, maxStateCount]);

  const mapClickHandler = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData({ ...formData, location: { lat, lng } });
  };

  const handleZoomChanged = () => {
    if (map) setZoom(map.getZoom());
  };

  return (
    <>
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={formData.location || indiaCenter}
          zoom={zoom}
          onLoad={(mapInstance) => setMap(mapInstance)}
          onClick={mapClickHandler}
          onZoomChanged={handleZoomChanged}
        >
          {/* Circles shrink dynamically between zoom 7 → 8 */}
          {issues.map((issue, idx) => {
            let circleRadius = 0;
            let circleOpacity = 0;

            if (zoom >= 7 && zoom < 8) {

              const factor = 8 - zoom; 
              circleRadius = getCircleRadius(7) * factor;
              circleOpacity = factor;
            } else if (zoom >= 8) {

              circleRadius = 20000; 
              circleOpacity = 0.8;
            }

            return (
              <Circle
                key={circle-${idx}}
                center={{ lat: issue.lat, lng: issue.lng }}
                radius={circleRadius}
                options={{
                  ...circleOptions,
                  fillOpacity: circleOpacity * 0.6,
                  strokeOpacity: circleOpacity * 0.8,
                }}
              />
            );
          })}


          {zoom >= 8 &&
            issues.map((issue, idx) => (
              <Marker
                key={idx}
                position={{ lat: issue.lat, lng: issue.lng }}
                onClick={() => setSelectedIssue(issue)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
              />
            ))}


          {selectedIssue && (
            <InfoWindow
              position={{ lat: selectedIssue.lat, lng: selectedIssue.lng }}
              onCloseClick={() => setSelectedIssue(null)}
            >
              <div style={{ color: "black" }}>
                <h3>{selectedIssue.title}</h3>
                <p><b>Category:</b> {selectedIssue.category}</p>
                <p><b>Description:</b> {selectedIssue.description}</p>
                <p><b>Reported By:</b> {selectedIssue.reportedBy}</p>
                <p><b>Date:</b> {selectedIssue.date}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {error && <p>Error: {error}</p>}
    </>
  );
}