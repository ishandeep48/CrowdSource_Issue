import { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useLayoutEffect } from "react";

export default function User() {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
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
  const [error, setError] = useState(null);
  const [pic, setPic] = useState(null);
  const [resID, setResID] = useState(null);
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
  }, []);
  const containerStyle = {
    width: "500px",
    height: "500px",
  };
  // changes the location
  const mapClickHandler = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData({
      ...formData,
      location: {
        lat: lat,
        lng: lng,
      },
    });
  };
  // to send to backend
  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(formData);
    // console.log(pic)
    const sendForm = new FormData();
    sendForm.append("pic", pic);
    sendForm.append("data", JSON.stringify(formData));
    try {
      const res = await axios.post("http://localhost/submitissue", sendForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = res.data;
      if (data.success) {
        setResID(data.issueID);
        setFormData({
          issue: "",
          priority: priorityOptions[0],
          // picture: "",
        });
        setPic(null);
      } else {
        setResID("Couldnt save to database try to send again");
      }
      // console.log(data)
    } catch (err) {
      console.log(err);
      setError(err);
    }
  };
  return (
    <>
    <form onSubmit={handleSubmit}>
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
      </div>
      {/* <button onClick={getLocation}>Click to get Your Location</button> */}
      {/* <button onClick={handleSubmit}>Submit</button> */}
      <button type="submit">Submit</button>
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
      </LoadScript>
      {/* for debug */}
      {error && <p>Error is: {error}</p>}
      {resID && <p>Your result for uploading is : {resID}</p>}
    </>
  );
}
