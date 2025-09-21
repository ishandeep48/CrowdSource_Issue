import React, { useState } from "react";
import {
  FaTimes,
  FaShare,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import Heatmap from "../Admin/Heatmap"; // adjust path if needed
import axios from 'axios';
const DepartmentIssueModal = ({ issue, onClose, onUpdateStatus }) => {
  if (!issue) return null;

  const handleStatusUpdate = async() => {
    // onUpdateStatus(issue.id, selectedStatus);
    console.log("Resolved :", issue.ID);
    try{
      const response = await axios.post('http://localhost/dept/resolveIssue',{issueID:issue.ID},{withCredentials:true});
      const data = response.data;
      if(data.success){
        alert(data.message)
      }else{
        alert(data.message)
      }
      }catch(err){
        console.warn(err)
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "forwarded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      // case "Pending": return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0,0,0,0.3)", // semi-transparent overlay
        backdropFilter: "blur(5px)", // blur effect
      }}
      onClick={onClose} // optional: click outside to close
    >
      <div
        className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Issue Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">ID: {issue.ID}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Issue Title & Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              {issue.department.toUpperCase()} Issue
            </h3>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          {/* Status & Priority Badges */}
          <div className="flex flex-wrap gap-3">
            <div
              className={`px-3 py-2 rounded-full border ${getPriorityColor(
                issue.priority
              )} font-medium text-sm`}
            >
              <FaExclamationTriangle className="inline mr-2" />
              {issue.priority.toUpperCase()} Priority
            </div>
            <div
              className={`px-3 py-2 rounded-full border ${getStatusColor(
                issue.status
              )} font-medium text-sm`}
            >
              <FaTag className="inline mr-2" />
              {issue.status.toUpperCase()}
            </div>
          </div>

          {/* Issue Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FaTag className="text-blue-500 mr-2" />
                <label className="text-sm font-semibold text-gray-700">
                  Category
                </label>
              </div>
              <p className="text-gray-800 font-medium">{issue.department}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-green-500 mr-2" />
                <label className="text-sm font-semibold text-gray-700">
                  Reported Date
                </label>
              </div>
              <p className="text-gray-800 font-medium">
                {new Date(issue.reportedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:col-span-2">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <label className="text-sm font-semibold text-gray-700">
                  Location
                </label>
              </div>
              <p className="text-gray-800 font-medium">{issue.state}</p>
            </div>
          </div>

          {/* Citizen Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FaUser className="text-blue-600 mr-2" />
              <label className="text-sm font-semibold text-gray-700">
                Citizen Information
              </label>
            </div>
            <p className="text-gray-800 font-medium">{issue.reportedBy.name}</p>
            <p className="text-gray-600 text-sm">{issue.reportedBy.phone}</p>
          </div>

          {/* Map */}
          {issue.location && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                Location Map
              </h4>
              <div
                style={{ width: "100%", height: "250px" }}
                className="rounded-lg overflow-hidden border border-gray-300"
              >
                <Heatmap
                  center={{
                    lat: issue.location.coordinates[1],
                    lng: issue.location.coordinates[0],
                  }}
                  showFilters={false}
                  defZoom={15}
                />
              </div>
            </div>
          )}

          {/* Actions Section */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            <h4 className="font-semibold text-gray-800 mb-4">
              Issue Management
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Update Status */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Update Status
                </label>
                <button
                  onClick={handleStatusUpdate}
                  className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentIssueModal;
