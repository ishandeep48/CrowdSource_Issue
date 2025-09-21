import { useState, useEffect } from "react";
import NavbarUser from "./NavbarUser";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AreaIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [proximity, setProximity] = useState(3);
  const [selectedIssue, setSelectedIssue] = useState(null); // for modal
  const [location, setLocation] = useState({});

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        alert("Please allow location access to view nearby issues");
      }
    );
  };
  useEffect(() => {
    getLocation();
  }, []);
  const [errorModal, setErrorModal] = useState(null);

  const navigate = useNavigate();
  const [proximityInput, setProximityInput] = useState(proximity);

  useEffect(() => {
    const controller = new AbortController();

    const getNearbyIssues = async () => {
      try {
        const response = await axios.post(
          "http://localhost/user/nearbyissues",
          { location, distance: proximityInput },
          { withCredentials: true, signal: controller.signal }
        );
        const data = response.data.issues;
        console.log(data);
        const sortedIssues = data.sort((a, b) => b.reportedAt - a.reportedAt);
        setIssues(sortedIssues);
      } catch (err) {
        if (err.name !== "CanceledError") console.error(err);
      }
    };

    const timeoutId = setTimeout(() => {
      if (location && proximityInput) {
        getNearbyIssues();
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [location, proximityInput]);

  const handleUpvote = async(id) => {
    console.log(id);

try{
      const reponse = await axios.post('http://localhost/user/upvote',{issueID:id},{withCredentials:true});
      const data = reponse.data;
      if(data.success){
        if(data.code =='ALREADY'){
          console.log('already upvoted');
          alert('You have already upvoted this issue')
          // setResID(null)
          // setError('You have already upvoted this issue');
        }else if (data.code =='DONE'){
          setIssues((prev) =>
  prev.map((issue) =>
    issue.ID === id
      ? { ...issue, upvotes: [...issue.upvotes, data.userAdded] }
      : issue
  )
);

          // setError(null)
          // setResID('Upvoted Successfully')
        }
      }
    }catch(err){
      console.error(err);
      // setError(err);
    }

    // setIssues((prev) =>
    //   prev.map((issue) =>
    //     issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
    //   )
    // );
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
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (val > 3) {
                    // setErrorModal("Proximity cannot be more than 3 km");
                    setProximityInput(3);
                  } else if(val < 0.5){
                    // setErrorModal("Proximity cannot be less than 0.5 km");
                    setProximityInput(0.5);
                  }else {
                    setProximityInput(val);
                  }
                }}
                className="border rounded p-2 w-full text-gray-900"
                placeholder="0.5 - 3 km"
              />
            </div>
          </div>

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
                  <h2 className="text-xl font-semibold mb-2">
                    {issue.department}
                  </h2>
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
          <div className="fixed inset-0 flex items-center justify-center z-50  bg-gray-200 bg-opacity-30 px-2 sm:px-0">
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
              <h2 className="text-2xl font-bold mb-2">
                {selectedIssue.department}
              </h2>
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
              <h2 className="text-lg sm:text-xl font-bold mb-2 text-red-600">
                Invalid Input
              </h2>
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
