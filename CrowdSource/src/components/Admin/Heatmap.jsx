import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  HeatmapLayer,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";

const containerStyle = { width: "75%", height: "100%" };

export default function Heatmap({ center }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(5);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef(null);

  const initialCenter = center || { lat: 20.5937, lng: 78.9629 };
  const [currentCenter, setCurrentCenter] = useState(initialCenter);

  // --- FILTER STATE ---
  const [filters, setFilters] = useState({
    priority: "all",
    department: "all",
    minReports: 0,
  });

  useEffect(() => {
    if (center) return;
    const getIssues = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost/allissues");
        if (response.data && Array.isArray(response.data.issues)) {
          setIssues(response.data.issues);
        }
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getIssues();
  }, [center]);

  // --- FILTERED ISSUES ---
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (filters.priority !== "all" && issue.priority !== filters.priority) return false;
      if (filters.department !== "all" && issue.department !== filters.department) return false;
      if (issue.reportCount < filters.minReports) return false;
      return true;
    });
  }, [issues, filters]);

  // --- HEATMAP DATA ---
  const heatmapData = useMemo(() => {
    if (!mapLoaded || !window.google || !filteredIssues) return [];
    return filteredIssues.map(
      (issue) => new window.google.maps.LatLng(issue.location.lat, issue.location.lng)
    );
  }, [mapLoaded, filteredIssues]);

  // --- MARKERS ---
  const markers = useMemo(() => {
    return filteredIssues.map((issue) => (
      <Marker
        key={issue._id}
        position={{ lat: issue.location.lat, lng: issue.location.lng }}
        title={issue.title}
        onClick={() => setSelectedIssue(issue)}
      />
    ));
  }, [filteredIssues]);

  // --- MAP HANDLER ---
  const handleMapIdle = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom();
      const newCenter = mapRef.current.getCenter().toJSON();
      setZoom(newZoom);
      setCurrentCenter(newCenter);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* --- FILTER PANEL --- */}
      <div style={{ width: "25%", padding: "10px", background: "#f8f9fa", borderRight: "1px solid #ddd" }}>
        <h3>Filters</h3>
        <div>
          <label>Priority: </label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label>Department: </label>
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="all">All</option>
            <option value="roads">Roads</option>
            <option value="sanitation">Sanitation</option>
            <option value="electricity">Electricity</option>
            <option value="water">Water</option>
          </select>
        </div>
        <div>
          <label>Min Reports: </label>
          <input
            type="number"
            value={filters.minReports}
            onChange={(e) => setFilters({ ...filters, minReports: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* --- MAP SECTION --- */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentCenter}
        zoom={zoom}
        onLoad={(map) => {
          mapRef.current = map;
          setMapLoaded(true);
        }}
        onIdle={handleMapIdle}
      >
        {isLoading && <p style={{ color: "black" }}>Loading issues...</p>}
        {!center && mapLoaded && zoom < 11 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 40,
              opacity: 0.7,
              dissipating: true,
            }}
          />
        )}
        {mapLoaded &&
          (center ? <Marker position={center} /> : zoom >= 11 && markers)}
        {selectedIssue && (
          <InfoWindow
            position={{
              lat: selectedIssue.location.lat,
              lng: selectedIssue.location.lng,
            }}
            onCloseClick={() => setSelectedIssue(null)}
          >
            <div style={{ color: "black" }}>
              <h3>Issue ID: {selectedIssue._id}</h3>
              <p>{selectedIssue.description}</p>
              <p><strong>Priority:</strong> {selectedIssue.priority}</p>
              <p><strong>Department:</strong> {selectedIssue.department}</p>
              <p><strong>Reports:</strong> {selectedIssue.reportCount}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
