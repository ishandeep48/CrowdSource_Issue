import NavbarUser from "./NavbarUser"; 
import { useState } from "react";

export default function ReportedIssuesPage() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [issues] = useState([
    {
      id: "ISS-101",
      issue: "Streetlight not working near park",
      priority: "high",
      status: "pending",
      date: "2025-09-15",
      // Additional details for the modal
      description: "The streetlight near the entrance of Central Park has been flickering and completely stopped working two days ago. It's causing safety concerns for evening park visitors.",
      location: "Near Central Park entrance",
      department: "Public Works",
      updates: [
        { date: "2025-09-16", message: "Issue has been received and is being reviewed." },
        { date: "2025-09-17", message: "A technician has been assigned to inspect the issue." }
      ]
    },
    {
      id: "ISS-102",
      issue: "Pothole on main road",
      priority: "medium",
      status: "resolved",
      date: "2025-09-12",
      // Additional details for the modal
      description: "Large pothole (approx 2ft diameter, 6in deep) on Main Street between 5th and 6th Avenue. Several cars have reported damage to their tires.",
      location: "Main Street between 5th and 6th Ave",
      department: "Transportation",
      updates: [
        { date: "2025-09-13", message: "Issue confirmed and added to repair schedule." },
        { date: "2025-09-14", message: "Pothole has been repaired and road is safe for travel." }
      ]
    },
    {
      id: "ISS-103",
      issue: "Garbage not collected",
      priority: "critical",
      status: "pending",
      date: "2025-09-10",
      // Additional details for the modal
      description: "Garbage hasn't been collected for 5 days in the downtown area. Bins are overflowing and creating sanitation issues.",
      location: "Downtown area, 3rd Street",
      department: "Sanitation",
      updates: [
        { date: "2025-09-11", message: "Issue logged and being investigated." }
      ]
    },
  ]);

  const priorityColors = {
    low: "bg-green-100 text-green-700 border-green-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    high: "bg-orange-100 text-orange-700 border-orange-300",
    critical: "bg-red-100 text-red-700 border-red-300",
  };

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-300",
    resolved: "bg-green-50 text-green-700 border-green-300",
  };

  const handleRowClick = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar on top */}
      <NavbarUser />

      {/* Page content */}
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Reported Issues
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600 text-sm border-b">
                  <th className="py-3 px-4">Issue ID</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(issue)}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {issue.id}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{issue.issue}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${priorityColors[issue.priority]}`}
                      >
                        {issue.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${statusColors[issue.status]}`}
                      >
                        {issue.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{issue.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for issue details */}
      {isModalOpen && selectedIssue && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Issue Details</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Issue ID</h3>
                  <p className="text-lg font-semibold text-gray-900">{selectedIssue.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Reported</h3>
                  <p className="text-lg text-gray-900">{selectedIssue.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <p className="text-lg">
                    <span className={`px-2 py-1 rounded ${priorityColors[selectedIssue.priority]}`}>
                      {selectedIssue.priority.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg">
                    <span className={`px-2 py-1 rounded ${statusColors[selectedIssue.status]}`}>
                      {selectedIssue.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500">Issue Description</h3>
                <p className="text-lg mt-1 bg-gray-100 text-gray-900 p-4 rounded-lg leading-relaxed">{selectedIssue.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-lg mt-1 text-gray-900">{selectedIssue.location}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500">Assigned Department</h3>
                <p className="text-lg mt-1 text-gray-900">{selectedIssue.department}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Status Updates</h3>
                <div className="space-y-4">
                  {selectedIssue.updates.map((update, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        {index < selectedIssue.updates.length - 1 && (
                          <div className="w-0.5 h-16 bg-blue-200 mt-1"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-gray-500">{update.date}</p>
                        <p className="text-gray-800">{update.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end">
                <button 
                  onClick={closeModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}