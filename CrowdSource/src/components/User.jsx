import { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function User() {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let priorityOptions = ["low", "medium", "high", "critical"];
  const formDataStruct = {
    issue: "",
    priority: priorityOptions,
    picture: "",
    location: {
      lat: 0,
      lng: 0,
    },
  };
  const [formData, setFormData] = useState(formDataStruct);
  const [error, setError] = useState(null);
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
  const containerStyle = {
    width: "500px",
    height: "500px",
  };
  const mapClickHandler =(e) =>{
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData({
      ...formData,
      location: {
        lat: lat,
        lng: lng,
      },
    });
  }
  return (
    <>
      <input
        type="text"
        placeholder="Your Issue"
        value={formData.issue}
        onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
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
      <button onClick={getLocation}>Click to get Your Location</button>
      <button onClick={() => console.log(formData)}>Submit</button>
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={formData.location}
          zoom={10}
          onClick={mapClickHandler}
        >
          <Marker position={formData.location} />
        </GoogleMap>

      </LoadScript>
    </>
  );
}
