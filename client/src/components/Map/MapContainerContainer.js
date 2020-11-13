import React, { useContext } from "react";
import { LngLatContext } from "./LngLatContext";
import MapContainer from "./MapContainer";

export default function MapContainerContainer() {
	const { lngLat: {setLngLat} } = useContext(LngLatContext);
	console.log(setLngLat)
  return <MapContainer setLngLat={setLngLat} />;
}
