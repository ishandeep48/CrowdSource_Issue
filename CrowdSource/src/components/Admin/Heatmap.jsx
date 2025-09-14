import React, { useMemo, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  HeatmapLayer,
  Marker,
} from "@react-google-maps/api";
// import issues from "../../data/issues.js";
import { useCallback,useEffect } from "react";
import axios from "axios";
const containerStyle = { width: "600px", height: "600px" };
const indiaCenter = { lat: 20.5937, lng: 78.9629 };
// const initialOpacity = 0.7;

export default function User() {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(5);
  const mapRef = useRef(null);
  const heatmapRef = useRef(null);
  const [issues,setIssues] = useState(null)
  const heatmapData = useMemo(() => {
    if (!mapLoaded || !window.google || !issues) return [];
    return issues.map(
      (issue) => new window.google.maps.LatLng(issue.location.lat, issue.location.lng)
    );
  }, [mapLoaded,issues]);

  useEffect(()=>{
    const getIssue = async() =>{
      const response =await axios.get('http://localhost/allissues');
    let data;
    if(response.status==200){
      data = response.data;
    }
    setIssues(data.issues)
    }
    getIssue()
    
    // console.log(data)
  },[])

  const handleZoomChanged = () => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    setZoom(currentZoom);

    // not working
    //   if (currentZoom >= 11) {
    //   heatmapRef.current.setMap(null);
    // } else {
    //   heatmapRef.current.setMap(mapRef.current);
    // }
  };

  const markers = useMemo(() => {
    if (!issues) return [];
    return issues.map((issue) => (
      <Marker
        key={issue.id}
        position={{ lat: issue.location.lat, lng: issue.location.lng }}
        title={issue.title}
      />
    ));
  }, [issues]);

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["visualization"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={indiaCenter}
        zoom={zoom}
        onLoad={(map) => {
          mapRef.current = map;
          setMapLoaded(true);
        }}
        onIdle={handleZoomChanged}
      >
        {mapLoaded && (
          <HeatmapLayer
            onLoad={(heatmap) => {
              heatmapRef.current = heatmap;
            }}
            data={heatmapData}
            options={{
              radius: 40,
              opacity: 0.7,
              dissipating: true,
            }}
          />
        )}

        {mapLoaded && zoom >= 11 && markers}
      </GoogleMap>
    </LoadScript>
  );
}
