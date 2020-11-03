import React from "react";
import { Popup } from "react-mapbox-gl";

export default function InfoPopup({ coordinates, info, setShowPopup, showPopup }) {
	console.log("hits");
	// if(coordinates.length === 0){
	// 	return null
	// }

  return (
    // <Popup
    //   coordinates={coordinates}
    //   onClick={() => (setShowPopup(false))}
		// >
		<form>

      <h1>Popup {info}</h1>
			<input type='text' name='asdf'/>
			<label htmlFor='asdf'>pu tur shit</label>
		</form>
    // </Popup>
  );
}
