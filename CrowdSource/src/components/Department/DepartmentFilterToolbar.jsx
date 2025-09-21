import React from "react";
import { FaFilter, FaMapMarkerAlt } from "react-icons/fa";

const DepartmentFilterToolbar = ({ filters, handleFilterChange, clearFilters }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2 text-gray-900">
        <FaFilter />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      {/* Location input */}
      <div className="relative flex-grow">
        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Priority dropdown */}
      <select
        value={filters.priority}
        onChange={(e) => handleFilterChange("priority", e.target.value)}
        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Status dropdown */}
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      >
        <option value="">All Statuses</option>
        <option value="forwarded">Forwarded</option>
        {/* <option value="reported">In Progress</option> */}
        <option value="resolved">Resolved</option>
      </select>

      {/* Clear button */}
      <button
        onClick={clearFilters}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

export default DepartmentFilterToolbar;
