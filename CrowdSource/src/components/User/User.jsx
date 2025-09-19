import { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useLayoutEffect } from "react";
import NavbarUser from "./NavbarUser";
import ReportIssue from "./ReportIssue";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();
  // const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let priorityOptions = ["low", "medium", "high", "critical"];
  const formDataStruct = {
    issue: "",
    priority: priorityOptions[0],
    // picture: "",
    location: {
      lat: 0,
      lng: 0,
    },
  };
  const [formData, setFormData] = useState(formDataStruct);
  // const [error, setError] = useState(null);
  // const [pic, setPic] = useState(null);
  // const [resID, setResID] = useState(null);
  const [userData ,setUserData] = useState({})
  //gets current location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  };
  useLayoutEffect(() => {
    getLocation();
     const storedUser = localStorage.getItem('userDetail');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      // console.log(parsedUser);
      setUserData(parsedUser);
    } catch (err) {
      console.error("Failed to parse user data:", err);
      setUserData({});
    }
  } else {
    setUserData({});
  }
  }, []);
  // const containerStyle = {
  //   width: "700x",
  //   height: "450px",
  // };
  // changes the location
  // const mapClickHandler = (e) => {
  //   const lat = e.latLng.lat();
  //   const lng = e.latLng.lng();
  //   setFormData({
  //     ...formData,
  //     location: {
  //       lat: lat,
  //       lng: lng,
  //     },
  //   });
  // };
  // // to send to backend
  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   // console.log(formData);
  //   // console.log(pic)
  //   const sendForm = new FormData();
  //   sendForm.append("pic", pic);
  //   sendForm.append("data", JSON.stringify(formData));
  //   try {
  //     const res = await axios.post("http://localhost/submitissue", sendForm, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     const data = res.data;
  //     if (data.success) {
  //       setResID(data.issueID);
  //       setFormData({
  //         issue: "",
  //         priority: priorityOptions[0],
  //         // picture: "",
  //       });
  //       setPic(null);
  //       setShowReportModal(false);
  //     } else {
  //       setResID("Couldnt save to database try to send again");
  //     }
  //     // console.log(data)
  //   } catch (err) {
  //     console.log(err);
  //     setError(err);
  //   }
  // };
  return (
    <>
    <div className="min-h-screen bg-gray-100">
    <NavbarUser />
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="text-center max-w-5xl mx-auto w-full">
          <h1 className="font-bold text-black leading-tight px-2" style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 3.75rem)',
            marginBottom: 'clamp(1rem, 3vw, 2rem)'
          }}>
           Hello {userData.name}
          </h1>
          <br />
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed px-4" style={{
            fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
            marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)'
          }}>
             Help improve your community by reporting issues or tracking existing ones
          </p>
          <button className="bg-[#1E5EFF] text-white font-bold rounded-lg hover:bg-[#164bcc] transition-colors duration-200 shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none" style={{
            padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(1.5rem, 4vw, 2.5rem)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
            
          }}
          onClick={ () => navigate("/report-issue") }>
           Report an Issue
          </button>
          <br />
          <br />
           <button className="bg-[#1E5EFF] text-white font-bold rounded-lg hover:bg-[#164bcc] transition-colors duration-200 shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none" style={{
            padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(1.5rem, 4vw, 2.5rem)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
            
          }}
          
          onClick={() => navigate("/reported-issues")}>
            Reported Issue
          </button>
          </div>
      </div>
    {/* <form onSubmit={handleSubmit}>
      <div className="max-w-7xl mx-auto p-6"></div>
      <input
        type="text"
        placeholder="Your Issue"
        value={formData.issue}
        onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
        required
      />
      <select
        name="priority"
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
      >
        {priorityOptions.map((option) => {
          return <option value={option}>{option.toUpperCase()}</option>;
        })}
      </select>
      <div>
        <p>Your Longitude is: {formData.location.lng}</p>
        <p>Your Latitude is: {formData.location.lat}</p>
      </div>
      <div>
        <p>Pci upload ke liye</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPic(e.target.files[0])}
          capture="environment"
          required
        />
        {pic && (
          <div>
            <p>Preview:</p>
            <img
              src={URL.createObjectURL(pic)}
              alt="preview"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          </div>
        )}
      </div> */}
      {/* <button onClick={getLocation}>Click to get Your Location</button> */}
      {/* <button onClick={handleSubmit}>Submit</button> */}
      {/* <button type="submit">Submit</button>
      </form>
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={formData.location}
          zoom={10}
          onClick={mapClickHandler}
        >
          <Marker position={formData.location} />
        </GoogleMap>
      </LoadScript> */}
      {/* for debug */}
    
        {/* Modal/Popup for issue reporting */}
       
      </div>
    </>
  );
}