import React from "react";
import { Popup } from "react-mapbox-gl";

export default function InfoPopup({ coordinates, info, setShowPopup }) {
  console.log("hits");

  return (
    <Popup coordinates={coordinates} onClick={()=>setShowPopup(false)}>
      <h1>Popup {info}</h1>
    </Popup>
  );
}
