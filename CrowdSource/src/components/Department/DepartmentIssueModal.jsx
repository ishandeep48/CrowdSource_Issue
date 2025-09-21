import React, { useState } from "react";
import { FaTimes, FaShare, FaExclamationTriangle, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaTag } from "react-icons/fa";
import Heatmap from "../Admin/Heatmap"; // adjust path if needed

const DepartmentIssueModal = ({ issue, onClose, onForward, onChangePriority, onUpdateStatus }) => {
  const [selectedForwardDept, setSelectedForwardDept] = useState("Public Works");
  const [selectedPriority, setSelectedPriority] = useState(issue?.priority || "Medium");
  const [selectedStatus, setSelectedStatus] = useState(issue?.status || "Pending");

  if (!issue) return null;

  const handleStatusUpdate = () => {
    onUpdateStatus(issue.id, selectedStatus);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "bg-green-100 text-green-800 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
   <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0,0,0,0.3)", // semi-transparent overlay
        backdropFilter: "blur(5px)",        // blur effect
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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Issue Details</h2>
            <p className="text-sm text-gray-600 mt-1">ID: #{issue.id}</p>
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
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{issue.title}</h3>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          {/* Status & Priority Badges */}
          <div className="flex flex-wrap gap-3">
            <div className={`px-3 py-2 rounded-full border ${getPriorityColor(issue.priority)} font-medium text-sm`}>
              <FaExclamationTriangle className="inline mr-2" />
              {issue.priority} Priority
            </div>
            <div className={`px-3 py-2 rounded-full border ${getStatusColor(issue.status)} font-medium text-sm`}>
              <FaTag className="inline mr-2" />
              {issue.status}
            </div>
          </div>

          {/* Issue Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FaTag className="text-blue-500 mr-2" />
                <label className="text-sm font-semibold text-gray-700">Category</label>
              </div>
              <p className="text-gray-800 font-medium">{issue.category}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-green-500 mr-2" />
                <label className="text-sm font-semibold text-gray-700">Reported Date</label>
              </div>
              <p className="text-gray-800 font-medium">{issue.reportedDate}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:col-span-2">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <label className="text-sm font-semibold text-gray-700">Location</label>
              </div>
              <p className="text-gray-800 font-medium">{issue.location}</p>
            </div>
          </div>

          {/* Citizen Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FaUser className="text-blue-600 mr-2" />
              <label className="text-sm font-semibold text-gray-700">Citizen Information</label>
            </div>
            <p className="text-gray-800 font-medium">{issue.citizenName}</p>
            <p className="text-gray-600 text-sm">{issue.citizenPhone}</p>
          </div>

          {/* Map */}
          {issue.lat && issue.lng && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                Location Map
              </h4>
              <div style={{ width: "100%", height: "250px" }} className="rounded-lg overflow-hidden border border-gray-300">
                <Heatmap center={{ lat: issue.lat, lng: issue.lng }} />
              </div>
            </div>
          )}

          {/* Actions Section */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Issue Management</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Forward Department */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Forward to Department</label>
                <select
                  value={selectedForwardDept}
                  onChange={(e) => setSelectedForwardDept(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-800 bg-white"
                >
                  <option value="Public Works" className="text-gray-800">Public Works</option>
                  <option value="Water Department" className="text-gray-800">Water Department</option>
                  <option value="Sanitation" className="text-gray-800">Sanitation</option>
                </select>
                <button
                  onClick={() => onForward && onForward(issue.id, selectedForwardDept)}
                  className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <FaShare /> Forward Issue
                </button>
              </div>

              {/* Change Priority */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Change Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-800 bg-white"
                >
                  <option value="High" className="text-gray-800">High</option>
                  <option value="Medium" className="text-gray-800">Medium</option>
                  <option value="Low" className="text-gray-800">Low</option>
                </select>
                <button
                  onClick={() => onChangePriority && onChangePriority(issue.id, selectedPriority)}
                  className="mt-3 w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <FaExclamationTriangle /> Update Priority
                </button>
              </div>

              {/* Update Status */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Update Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-800 bg-white"
                >
                  <option value="Pending" className="text-gray-800">Pending</option>
                  <option value="In Progress" className="text-gray-800">In Progress</option>
                  <option value="Resolved" className="text-gray-800">Resolved</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  Update Status
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