import React,{useState} from "react";
import { FaTimes, FaShare, FaExclamationTriangle } from "react-icons/fa";
import Heatmap from "../Admin/Heatmap"; // adjust path if needed

const IssueModal = ({ issue, onClose, onForward, onChangePriority }) => {
  if (!issue) return null;
  const [selectedPriority, setSelectedPriority] = useState(issue?.priority || "Medium");
  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
  };
  const handleChangePriorityClick = () => {
    // console.log(issue.ID,selectedPriority)
    onChangePriority(issue.ID, selectedPriority); // pass issue ID + new priority
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Issue Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">{issue.description}</h3>
            {/* <p className="text-gray-600">{issue.description}</p> */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <p className="text-sm text-gray-600">{issue.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <p className="text-sm text-gray-600">{issue?.priority}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <p className="text-sm text-gray-600">Location here</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reported Date</label>
              <p className="text-sm text-gray-600">{new Date(issue.reportedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Citizen Information</label>
            <p className="text-sm text-gray-600">{issue.reportedBy.name} - {issue.reportedBy.phone}</p>
          </div>

          {issue.location && (
            <div className="location-map">
              <h4 className="font-medium text-gray-800 mb-2">Location Map</h4>
              <div style={{ width: "100%", height: "300px" }} className="rounded-lg overflow-hidden">
                <Heatmap center={{ lat: issue.location.coordinates[1], lng: issue.location.coordinates[0] }} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forward to Department</label>
              <select className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Public Works</option>
                <option>Water Department</option>
                <option>Sanitation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Change Priority</label>
              <select className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedPriority}
              onChange={handlePriorityChange}
              >
                <option value ='high'>High</option>
                <option  value ='medium'>Medium</option>
                <option  value ='low'>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
              <select disabled className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 p-6 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onForward} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FaShare /> Forward
          </button>
          <button onClick={handleChangePriorityClick} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
            <FaExclamationTriangle /> Change Priority
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
