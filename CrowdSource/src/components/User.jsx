import { useState, useRef } from "react";

export default function User() {
  let priorityOptions = ["low", "medium", "high", "critical"];
  const formDataStruct = {
    issue: "",
    priority: priorityOptions,
    picture: "",
    location: {
      lat: 0,
      long: 0,
    },
  };
  const [formData, setFormData] = useState(formDataStruct);
  const [error,setError] = useState(null);
  const getLocation =()=>{
    if(!navigator.geolocation){
        setError("Geolocation is not supported by your browser");
        return;
    }
    navigator.geolocation.getCurrentPosition((pos)=>{
        setFormData({
            ...formData,
            location:{
                lat:pos.coords.latitude,
                long:pos.coords.longitude
            }
        });
    },(err)=>{
        setError(err.message);
    }
    )
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
        <p>Your Longitude is: {formData.location.long}</p>
        <p>Your Latitude is: {formData.location.lat}</p>
      </div>
      <button onClick={getLocation}>Click to get Your Location</button>
      <button onClick={() => console.log(formData)}>Submit</button>
    </>
  );
}
