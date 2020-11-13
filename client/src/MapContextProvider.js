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
  const [buildMapMounted, setBuildMapMounted] = useState(false);

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

  // // from build map
  // const [count, setCount] = useState(0);
  // useEffect(() => {
  //   setCount(() => count + 1);
  //   console.log(count);
  //   if (count <= 1) {
  //     const map = new mapboxgl.Map({
  //       container: "mapbox",
  //       style: mapStyle,
  //       center: [-94.6859, 46.5],
  //       zoom: 5,
  //       movingMethod: "easeTo",
  //       pitchWithRotate: false,
  //       dragRotate: false,
  //       touchZoomRotate: false,
  //     });
  //     setMapbox(map);
  //   }
  // }, [mapData]);

  const mapContextValue = {
    mapData,
    mapDataUpdated,
    setMapDataUpdated,
    mapbox,
    setMapbox,
    setNewFeature,
    setBuildMapMounted,
  };

  return (
    <MapContext.Provider value={mapContextValue}>
      {props.children}
    </MapContext.Provider>
  );
}
