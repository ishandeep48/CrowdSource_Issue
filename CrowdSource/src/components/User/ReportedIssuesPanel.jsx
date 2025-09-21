import { useEffect } from "react";
import NavbarUser from "./NavbarUser";
import { useState } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

export default function ReportedIssuesPage() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const reponse = await axios.get("http://localhost/reportedissues", {
        withCredentials: true,
      });
      const issues = reponse.data.issues;
      console.log(issues);
      setIssues(issues);
    };
    getData();
  }, []);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });
  const priorityColors = {
    low: "bg-green-100 text-green-700 border-green-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    high: "bg-orange-100 text-orange-700 border-orange-300",
    critical: "bg-red-100 text-red-700 border-red-300",
  };

  const statusColors = {
    reported: "bg-blue-50 text-blue-700 border-blue-300",
    reviewed: "bg-purple-50 text-purple-700 border-purple-300",
    forwarded: "bg-orange-50 text-orange-700 border-orange-300",
    resolved: "bg-green-50 text-green-700 border-green-300",
    cancelled: "bg-red-50 text-red-700 border-red-300",
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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/user")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 sm:mb-6 transition-colors px-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
          Reported Issues
        </h1>

        <div className="bg-white rounded-xl shadow-lg mx-2 sm:mx-0">
          {/* Mobile Card View */}
          <div className="block md:hidden">
            {issues.map((issue) => (
              <div
                key={issue.ID}
                className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleRowClick(issue)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm">
                      Issue #{issue.ID}
                    </h3>
                    <p className="text-gray-600 text-xs mt-1">
                      {new Date(issue.reportedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${
                        priorityColors[issue.priority]
                      }`}
                    >
                      {issue.priority.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${
                        statusColors[issue.status]
                      }`}
                    >
                      {issue.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">
                  {issue.description}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block p-6">
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
                      key={issue.ID}
                      className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(issue)}
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {issue.ID}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {issue.description}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                            priorityColors[issue.priority]
                          }`}
                        >
                          {issue.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                            statusColors[issue.status]
                          }`}
                        >
                          {issue.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(issue.reportedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for issue details */}
      {isModalOpen && selectedIssue && (
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={closeModal}
          />
          
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative z-10 mx-2 sm:mx-0">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Issue Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Issue ID
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedIssue.ID}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date Reported
                  </h3>
                  <p className="text-lg text-gray-900">
                    {new Date(selectedIssue.reportedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      }
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Priority
                  </h3>
                  <p className="text-lg">
                    <span
                      className={`px-2 py-1 rounded ${
                        priorityColors[selectedIssue.priority]
                      }`}
                    >
                      {selectedIssue.priority.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg">
                    <span
                      className={`px-2 py-1 rounded ${
                        statusColors[selectedIssue.status]
                      }`}
                    >
                      {selectedIssue.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500">
                  Issue Description
                </h3>
                <p className="text-base sm:text-lg mt-1 bg-gray-100 text-gray-900 p-3 sm:p-4 rounded-lg leading-relaxed">
                  {selectedIssue.description}
                </p>
              </div>

              {/* Location + Reported Image - Mobile Stack, Desktop Side by Side */}
              <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Location */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <div
                    className="border rounded-lg overflow-hidden shadow-md mt-2"
                    style={{ height: "250px" }}
                  >
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={{
                          width: "100%",
                          height: "100%",
                        }}
                        center={{
                          lat: selectedIssue.location.coordinates[1] || 0,
                          lng: selectedIssue.location.coordinates[0] || 0,
                        }}
                        zoom={13}
                        options={{
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                        }}
                      >
                        <Marker
                          position={{
                            lat: selectedIssue.location.coordinates[1],
                            lng: selectedIssue.location.coordinates[0],
                          }}
                        />
                      </GoogleMap>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <p className="text-gray-500">Loading Map...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reported Image */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Reported Image
                  </h3>
                  <div className="mt-2">
                    {selectedIssue.imgURL ? (
                      <img
                        src={selectedIssue.imgURL}
                        alt="Reported Issue"
                        className="rounded-lg shadow-md w-full h-[250px] object-contain border border-gray-200"
                      />
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-gray-300 h-[250px] flex items-center justify-center">
                        <p className="text-gray-500 italic">No image provided</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
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