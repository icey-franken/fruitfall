import React, { useState, useEffect } from "react";

export const MapContext = React.createContext({});

export default function MapContextProvider(props) {
  // this is a dummy value to avoid "invalid geojson" error and "cannot read length of undefined" and "cannot read property of '1'" error
  const [mapData, setMapData] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        properties: { id: 0 },
        geometry: { coordinates: [-93.265, 44.9778], type: "Point" },
      },
    ],
	});

  const mapContextValue = {
    mapData,
  };

  useEffect(() => {
    async function getMapData() {
      const res = await fetch("/api/features/");
      const res_data = await res.json();
      setMapData(res_data);
    }
    getMapData();
	}, []);

	// on form submission we can add to map data from here and avoid loading entire database again
  return (
    <MapContext.Provider value={mapContextValue}>
      {props.children}
    </MapContext.Provider>
  );
}
