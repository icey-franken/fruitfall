import React, { useState, useEffect, useRef } from "react";
import { accessToken, mapStyle } from "./config";
import mapboxgl from "mapbox-gl";
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

  // load map data from db immediately
  useEffect(() => {
    console.log("--------------------hits get map data use effect");
    async function getMapData() {
      const res = await fetch("/api/features/");
      const res_data = await res.json();
      setMapData(res_data);
      console.log(
        "--------------------get map data use effect data:",
        res_data
      );
    }
    getMapData();
  }, []);

  // the intention of this is to be a trigger - reload map
  const [mapDataUpdated, setMapDataUpdated] = useState(false);

	// mapbox set in build map after initial render - mapbox requires an HTML element container to hook to
	// we save it in context to reduce reload time
  const [mapbox, setMapbox] = useState(null);

  // on form submission we add set new feature. This hook is triggered and map source data updated
  const [newFeature, setNewFeature] = useState(null);
  useEffect(() => {
    if (newFeature) {
      // update map data
      const newMapData = {
        ...mapData,
        features: [...mapData.features, newFeature],
      };
      setMapData(() => newMapData);
      mapbox.getSource("fruitfall").setData(newMapData);
      setMapDataUpdated(true);
      setNewFeature(null);
    }
  }, [newFeature]);

  const mapContextValue = {
    mapData,
    mapDataUpdated,
    setMapDataUpdated,
    mapbox,
    setMapbox,
    setNewFeature,
  };

  return (
    <MapContext.Provider value={mapContextValue}>
      {props.children}
    </MapContext.Provider>
  );
}
