import React from "react";

export default function FilterPanel({ filters, onFilterChange }) {
  // A single handler to keep the JSX clean
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    onFilterChange({
      ...filters,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  return (
    <div style={{ width: "25%", padding: "10px", background: "#f8f9fa", borderRight: "1px solid #ddd" }}>
      <h3>Filters</h3>
      <div>
        <label>Priority: </label>
        <select name="priority" value={filters.priority} onChange={handleChange}>
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <label>Department: </label>
        <select name="department" value={filters.department} onChange={handleChange}>
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
          name="minReports"
          value={filters.minReports}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}