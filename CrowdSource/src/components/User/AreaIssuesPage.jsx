import { useState, useEffect } from "react";
import NavbarUser from "./NavbarUser";

// Mock data
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
  },
];

export default function AreaIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

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

  return (
    <>
      <NavbarUser />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            Reported Issues in Your Area
          </h1>

          <div className="space-y-4 sm:space-y-6">
            {issues.map((issue) => (
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
          <div className="fixed inset-0 flex items-center justify-center z-50  px-2 sm:px-0">
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
      </div>
    </>
  );
}
