import { useState, useEffect } from "react";
import NavbarUser from "./NavbarUser";
import { useNavigate } from "react-router-dom";

// Mock data with lat/lng added
const mockIssues = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description: "There's a large pothole causing traffic jams.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0274/7288/7913/files/MicrosoftTeams-image_32.jpg?v=1705315718",
    postedBy: "John Doe",
    location: "Main Street, Verdant City",
    status: "Pending",
    department: "Road Maintenance",
    reportedAt: new Date("2025-09-20T10:30:00"),
    upvotes: 5,
    lat: 28.6139,
    lng: 77.209,
  },
  {
    id: "2",
    title: "Streetlight not working",
    description: "The streetlight near Park Avenue is broken.",
    imageUrl:
      "https://www.shutterstock.com/image-photo/broken-street-lamp-against-blue-600nw-2440253019.jpg",
    postedBy: "Jane Smith",
    location: "Park Avenue, Verdant City",
    status: "In Progress",
    department: "Electricity Department",
    reportedAt: new Date("2025-09-21T08:15:00"),
    upvotes: 8,
    lat: 28.6155,
    lng: 77.211,
  },
];

// Haversine formula for distance in KM
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function AreaIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [proximity, setProximity] = useState(3)
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lng: 77.209 }); // mock location
 


  const navigate = useNavigate();
  const [proximityInput, setProximityInput] = useState(proximity);

const handleSearchProximity = () => {
  const value = parseFloat(proximityInput);
  if (!isNaN(value) && value >= 0.5 && value <= 3) {
    setProximity(value); // apply filter
  } else {
    setErrorModal("Please enter a valid number between 0.5 and 3 km");
  }
};
  useEffect(() => {
    const sortedIssues = mockIssues.sort(
      (a, b) => b.reportedAt - a.reportedAt
    );
    setIssues(sortedIssues);
  }, []);

  const handleUpvote = (id) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
      )
    );
  };

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
  };

  const closeModal = () => {
    setSelectedIssue(null);
  };

  // Filter issues based on proximity
  const filteredIssues = issues.filter((issue) => {
    const distance = getDistanceKm(
      userLocation.lat,
      userLocation.lng,
      issue.lat,
      issue.lng
    );
    return distance <= proximity;
  });

  return (
    <>
      <NavbarUser />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/user")}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
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
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            Reported Issues in Your Area
          </h1>

          {/* Proximity Input */}
          <div className="mb-6 flex items-end space-x-2">
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-900 mb-2">
      Filter by Proximity (km)
    </label>
    <input
      type="number"
      step="0.5"
      min="0.5"
      max="3"
      inputMode="decimal"
      value={proximityInput}
      onChange={(e) => setProximityInput(e.target.value)}
      className="border rounded p-2 w-full text-gray-900"
      placeholder="0.5 - 3 km"
    />
  </div>
  <button
    onClick={handleSearchProximity}
    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
  >
    Search
  </button>
</div>


          <div className="space-y-4 sm:space-y-6">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(issue)}
              >
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-3 sm:p-4">
                  <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                    {issue.title}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      className="bg-blue-500 text-white px-2 sm:px-3 py-1 text-sm sm:text-base rounded hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(issue.id);
                      }}
                    >
                      ▲ ({issue.upvotes})
                    </button>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {new Date(issue.reportedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 flex items-center justify-center z-50  bg-gray-200 bg-opacity-30
 px-2 sm:px-0">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
              <button
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-700 hover:text-gray-900 text-lg"
                onClick={closeModal}
              >
                ✕
              </button>
              <img
                src={selectedIssue.imageUrl}
                alt={selectedIssue.title}
                className="w-full h-40 sm:h-48 object-cover rounded mb-3 sm:mb-4"
              />
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{selectedIssue.title}</h2>
              <p className="text-gray-700 text-sm sm:text-base mb-2">
                {selectedIssue.description}
              </p>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <p>
                  <strong>Posted By:</strong> {selectedIssue.postedBy}
                </p>
                <p>
                  <strong>Location:</strong> {selectedIssue.location}
                </p>
                <p>
                  <strong>Status:</strong> {selectedIssue.status}
                </p>
                <p>
                  <strong>Department:</strong> {selectedIssue.department}
                </p>
                <p>
                  <strong>Reported On:</strong>{" "}
                  {selectedIssue.reportedAt.toLocaleString()}
                </p>
                <p>
                  <strong>Upvotes:</strong> {selectedIssue.upvotes}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Error Modal */}
{errorModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-40 px-2 sm:px-0">
    <div className="bg-white rounded-lg shadow-lg w-full sm:max-w-sm p-4 sm:p-6 relative">
      <button
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-lg"
        onClick={() => setErrorModal(null)}
      >
        ✕
      </button>
      <h2 className="text-lg sm:text-xl font-bold mb-2 text-red-600">Invalid Input</h2>
      <p className="text-gray-700 text-sm sm:text-base">{errorModal}</p>
      <button
        className="mt-4 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        onClick={() => setErrorModal(null)}
      >
        OK
      </button>
    </div>
  </div>
)}
      </div>
    </>
  );
}
