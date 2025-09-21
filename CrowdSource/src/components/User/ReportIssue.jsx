import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarUser from "./NavbarUser";
import DuplicateIssueModal from "./DuplicateIssueModal";
import { set } from "mongoose";

export default function ReportIssue() {
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const priorityOptions = ["low", "medium", "high", "critical"];

  const formDataStruct = {
    issue: "",
    priority: priorityOptions[0],
    location: { lat: 0, lng: 0 },
  };

  const [formData, setFormData] = useState(formDataStruct);
  const [pic, setPic] = useState(null);
  const [resID, setResID] = useState(null);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });
  // Speech Recognition
  const [language, setLanguage] = useState("en-IN"); // default to English

  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const recognitionRef = useRef(null);

useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language;

 recognition.onresult = (event) => {
  let finalTranscript = "";
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      finalTranscript += event.results[i][0].transcript;
    }
  }

  if (finalTranscript) {
    setFormData((prev) => ({
      ...prev,
      issue: prev.issue + (prev.issue ? " " : "") + finalTranscript,
    }));
  }
};


  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    setIsListening(false);
    isListeningRef.current = false;
  };

  recognition.onend = () => {
    if (isListeningRef.current) {
      try {
        recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  recognitionRef.current = recognition;

  return () => recognition.stop();
}, []); // Run once

// Update language dynamically
useEffect(() => {
  if (recognitionRef.current) recognitionRef.current.lang = language;
}, [language]);

const toggleListening = () => {
  if (!recognitionRef.current) return;

  if (isListeningRef.current) {
    recognitionRef.current.stop();
    setIsListening(false);
    isListeningRef.current = false;
  } else {
    try {
      recognitionRef.current.start();
      setIsListening(true);
      isListeningRef.current = true;
    } catch (err) {
      console.error(err);
      setIsListening(false);
      isListeningRef.current = false;
    }
  }
};


  // Get user location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));
      },
      (err) => {
        setError(err.message);
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: 40.7128,
            lng: -74.006,
          },
        }));
      }
    );
  };
  const handleUpvote = async(issueID) => {
    console.log(issueID);
    try{
      const reponse = await axios.post('http://localhost/user/upvote',{issueID},{withCredentials:true});
      const data = reponse.data;
      if(data.success){
        if(data.code =='ALREADY'){
          console.log('already upvoted');
          setResID(null)
          setError('You have already upvoted this issue');
        }else if (data.code =='DONE'){
          setError(null)
          setResID('Upvoted Successfully')
        }
      }
    }catch(err){
      console.error(err);
      setError(err);
    }
};

  useLayoutEffect(() => {
    getLocation();
  }, []);

  const containerStyle = { width: "100%", height: "400px" };

  const mapClickHandler = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData((prev) => ({ ...prev, location: { lat, lng } }));
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
    setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
  };

  // Form submission
  const [duplicateIssues, setDuplicateIssues] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sendForm = new FormData();
    sendForm.append("pic", pic);
    sendForm.append("data", JSON.stringify(formData));
    console.log(formData)
    try {
      const res = await axios.post("http://localhost/submitissue", sendForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      const data = res.data;
      if (data.success) {
        setResID(data.issueID);
        setFormData(formDataStruct);
        console.log("form data set to default");

      setPic(null);
      setError(null);
      getLocation();
      // Navigate back to user dashboard after successful submission
      // setTimeout(() => {
      //   navigate("/user");
      // }, 2000);
    } else {
      if(data.code === "DUPLICATE"){
      setDuplicateIssues(data.issues);
      setShowDuplicateModal(true);
      }else if(data.code === "SPAM"){
        setError("Issue detected as spam. Please Rephrase your issue with more clear words.");
        return;
      }else{
      setError("Couldn't save to database, try again");
      }
    }
  } catch (err) {
    console.error(err);
    setError(err.message || err);
  }
  
};
const handleForceSubmit = async(e) =>{
  e.preventDefault();
  const sendForm = new FormData();
  sendForm.append("pic",pic);
  sendForm.append('data',JSON.stringify(formData));
  sendForm.append('dept',duplicateIssues[0].department);
  console.log(sendForm)
  try{
    const response = await axios.post('http://localhost/forcesubmit',sendForm,{withCredentials:true});
    const data= response.data;
    if(data.success){
      setResID(data.issueID);
        setFormData(formDataStruct);
        console.log("form data set to default");

      setPic(null);
      setError(null);
      getLocation();
      setDuplicateIssues(null);
      setShowDuplicateModal(false);
    }
  }catch(err){
    console.error(err);
    setError(err);
  }
}
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <NavbarUser />

      {/* Back Button */}
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

      {/* Report Issue Form */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Report an Issue
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Description + Speech */}
            <div className="relative">
              <label
                htmlFor="issue"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Issue Description
              </label>

              {/* Language changer */}

              {/* <div className="mb-4">
                <label
                  htmlFor="language"
                  className="block text-gray-700 font-medium mb-2"
                >
                  <br />
                  Select Language
                </label>

                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="en-US">English (US)</option>

                  <option value="hi-IN">हिंदी (Hindi)</option>
                </select>
              </div> */}

              <textarea
                id="issue"
                placeholder="Describe the issue in detail..."
                value={formData.issue}
                onChange={(e) =>
                  setFormData({ ...formData, issue: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                rows={4}
                required
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute bottom-3 right-3 p-2 rounded-full ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors`}
                title={isListening ? "Stop recording" : "Start speech-to-text"}
              >
                {isListening ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Location */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Location
              </label>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Longitude:
                    </span>
                    <p className="text-blue-700 font-mono">
                      {formData.location.lng.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Latitude:</span>
                    <p className="text-blue-700 font-mono">
                      {formData.location.lat.toFixed(6)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Click on the map to change location
                </p>
              </div>
              <div
                className="border rounded-lg overflow-hidden shadow-md mb-4"
                style={{ height: "400px" }}
              >
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={formData.location || {lat: 0, lng: 0}}
                    zoom={15}
                    onClick={mapClickHandler}
                    onLoad={handleMapLoad}
                    // key={`${formData.location.lat}-${formData.location.lng}`}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    <Marker position={formData.location} />
                  </GoogleMap>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <p className="text-gray-500">Loading Map...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Picture Upload */}
            <div>
              <label
                htmlFor="picture"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Upload Picture
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">
                      {pic
                        ? "Change image"
                        : "Click to upload or drag and drop"}
                    </p>
                  </div>
                  <input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPic(e.target.files[0])}
                    capture="environment"
                    className="hidden"
                    required
                  />
                </label>
              </div>
              {pic && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </p>
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(pic)}
                      alt="preview"
                      className="w-40 h-40 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setPic(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/user")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
              >
                Submit Issue
              </button>
            </div>
          </form>
           <DuplicateIssueModal
    open={showDuplicateModal}
    issues={duplicateIssues}
    onCancel={() => setShowDuplicateModal(false)}
    onConfirm={handleForceSubmit}
    onUpvote = {handleUpvote}
  />
        </div>
      </div>

      {/* Error / Success Messages */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>Error: {error}</p>
          </div>
        </div>
      )}

      {resID && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>Issue reported successfully! ID: {resID}</p>
          </div>
        </div>
      )}
    </div>
  );
}
