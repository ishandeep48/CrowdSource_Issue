import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  HeatmapLayer,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";



export default function Heatmap({ center, showFilters=false, defZoom=5 }) {
  const width = showFilters ? "75%" : "100%";
  const containerStyle = { width: width, height: "100%" };
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(defZoom);
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
        const response = await axios.get("http://localhost/allissues",{withCredentials:true});
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
      
      // FIXED: Make the department comparison case-insensitive and safe for missing properties.
      if (filters.department !== "all" && issue.department?.toLowerCase() !== filters.department.toLowerCase()) {
        return false;
      }

      if (issue.reportCount < filters.minReports) return false;
      return true;
    });
  }, [issues, filters]);

  // --- HEATMAP DATA ---
  const heatmapData = useMemo(() => {
    if (!mapLoaded || !window.google || !filteredIssues) return [];
    console.log(filteredIssues)
    return filteredIssues.map(
      (issue) => new window.google.maps.LatLng(issue.location.coordinates[1], issue.location.coordinates[0])
    );
  }, [mapLoaded, filteredIssues]);

  // --- MARKERS ---
  const markers = useMemo(() => {
    return filteredIssues.map((issue) => (
      <Marker
        key={issue._id}
        position={{ lat: issue.location.coordinates[1], lng: issue.location.coordinates[0] }}
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
      {showFilters && (
      <div
        style={{
          width: "25%",
          padding: "10px",
          backgroundColor: "#ffffff", // white background
          borderRight: "1px solid #ddd",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          zIndex: 10,
          height: "100%",
          overflowY: "auto",
        }}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filters</h3>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority:</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800 bg-white"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800 bg-white"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="all">All</option>
            <option value="roads">Roads</option>
            <option value="sanitation">Sanitation</option>
            <option value="electricity">Electricity</option>
            <option value="water">Water</option>
            <option value="gas">Gas</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Reports:</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800 bg-white"
            value={filters.minReports}
            onChange={(e) => setFilters({ ...filters, minReports: Number(e.target.value) })}
          />
        </div>
      </div>
      )}

      {/* --- MAP SECTION --- */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentCenter|| {lat:0,lng:0}}
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
      lat: selectedIssue.location.coordinates[1],
      lng: selectedIssue.location.coordinates[0],
    }}
    onCloseClick={() => setSelectedIssue(null)}
  >
    <div className="bg-white rounded-lg shadow-lg max-w-xs w-full text-gray-800">
      {/* Header */}
      <div className="p-3 border-b">
        <h2 className="text-base font-semibold">Issue Details</h2>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 text-sm">
        <div>
          <span className="block font-medium text-gray-700">Issue ID</span>
          <p className="text-gray-600 break-words">{selectedIssue.ID}</p>
        </div>

        <div>
          <span className="block font-medium text-gray-700">Reported Date</span>
          <p className="text-gray-600">
            {new Date(selectedIssue.reportedAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <span className="block font-medium text-gray-700">Priority</span>
          <p className="capitalize text-gray-600">{selectedIssue.priority}</p>
        </div>

        <div>
          <span className="block font-medium text-gray-700">Status</span>
          <p className="capitalize text-gray-600">{selectedIssue.status}</p>
        </div>

        <div>
          <span className="block font-medium text-gray-700">Description</span>
          <p className="text-gray-600">{selectedIssue.description}</p>
        </div>

        {selectedIssue.imgURL && (
          <div>
            <span className="block font-medium text-gray-700">Image</span>
            <img
              src={selectedIssue.imgURL}
              alt="Issue"
              className="mt-2 w-full h-32 object-origin rounded-lg border"
            />
          </div>
        )}
      </div>
    </div>
  </InfoWindow>
)}

      </GoogleMap>
    </div>
  );
}
