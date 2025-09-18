import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Heatmap from "./Heatmap";
import FilterPanel from "./FilterPanel";
import { LoadScript } from "@react-google-maps/api"; // LoadScript should be here

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function MapPage() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    priority: "all",
    department: "all",
    minReports: 0,
  });

  // Fetch all issues once when the page loads
  useEffect(() => {
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
  }, []);

  // Calculate the filtered issues based on state
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (filters.priority !== "all" && issue.priority !== filters.priority) return false;
      if (filters.department !== "all" && issue.department !== filters.department) return false;
      if (issue.reportCount < filters.minReports) return false;
      return true;
    });
  }, [issues, filters]);

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["visualization"]}>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Pass filter state and the setter function to the panel */}
        <FilterPanel filters={filters} onFilterChange={setFilters} />

        {/* Pass only the filtered issues to the map */}
        <Heatmap issues={filteredIssues} isLoading={isLoading} />
      </div>
    </LoadScript>
  );
}