import { useState, useEffect } from "react";
import NavbarUser from "./NavbarUser";
import axios from "axios";

export default function AreaIssuesPage() {

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null); // for modal
  const [location,setLocation] =useState({});
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation( {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },)
        
      },
      (err) => {
      alert("Please allow location access to view nearby issues");
      }
    );
  };
  useEffect(()=>{
    getLocation();
  },[])
  useEffect(() => {
    const getNearbyIssues = async () => {
      const response = await axios.post("http://localhost/user/nearbyissues", {location},{ withCredentials: true });
      const data = response.data.issues;
      console.log(data);
      const sortedIssues = data.sort(
      (a, b) => b.reportedAt - a.reportedAt
    );
    setIssues(sortedIssues);
    }
    getNearbyIssues();
    
    
  }, [location]);

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
                key={issue.ID}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(issue)}
              >
                <img
                  src={issue.imgURL}
                  alt={issue.description}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{issue.department}</h2>
                  <p className="text-gray-600 mb-4">{issue.description}</p>
                  <div className="flex justify-between items-center">
                    <button
                      className="bg-blue-500 text-white px-2 sm:px-3 py-1 text-sm sm:text-base rounded hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(issue.ID);
                      }}
                    >
                      ▲ ({issue.upvotes.length})
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
                src={selectedIssue.imgURL}
                alt={selectedIssue.department}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{selectedIssue.department}</h2>
              <p className="text-gray-700 mb-2">{selectedIssue.description}</p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Posted By:</strong> {selectedIssue.reportedBy.name}
              </p>
              {/* <p className="text-sm text-gray-500 mb-1">
                <strong>Location:</strong> {selectedIssue.location}
              </p> */}
              <p className="text-sm text-gray-500 mb-1">
                <strong>Status:</strong> {selectedIssue.status}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Department:</strong> {selectedIssue.department}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Reported On:</strong>{" "}
                {new Date(selectedIssue.reportedAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Upvotes:</strong> {selectedIssue.upvotes.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
