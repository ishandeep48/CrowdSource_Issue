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
        const response = await axios.get("http://localhost/allissues",{withCredentials:true});
        if (response.data && Array.isArray(response.data.issues)) {
        // const issuesWithExtras = response.data.issues.map((issue) => {
        //   const [lng, lat] = issue.location.coordinates; // GeoJSON is [lng, lat]
        //   return {
        //     ...issue,
        //     location: { lat, lng }, // fix for Google Maps
        //     priority: issue.priority || "medium", // fallback dummy priority
        //     status: issue.status || "open", // fallback dummy status
        //     reportedDate: issue.reportedDate || new Date().toISOString(), // fallback
        //     image: `data:image/jpeg;base64,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`, // random but consistent
        //   };
        // });
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
