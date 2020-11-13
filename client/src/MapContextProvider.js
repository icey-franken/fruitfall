import React, { useState, useEffect, useRef } from "react";

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
    async function getMapData() {
      const res = await fetch("/api/features/");
      const res_data = await res.json();
      setMapData(res_data);
    }
    getMapData();
  }, []);

  // the intention of this is to be a trigger - reload map
  const [mapDataUpdated, setMapDataUpdated] = useState(false);

  // mapbox set in build map after initial render - mapbox requires an HTML element container to hook to
  const [mapbox, setMapbox] = useState(null);

  // on form submission we add to map data from here and avoid loading entire database again
  // this function passed to form and called on successful submission with db response as newFeature arg
  const updateMapData = (newFeature) => {
    const newMapData = {
      ...mapData,
      features: [...mapData.features, newFeature],
    };
    setMapData(() => newMapData);
    mapbox.getSource("fruitfall").setData(newMapData);
    setMapDataUpdated(true);
  };

  const mapContextValue = {
    mapData,
    updateMapData,
    mapDataUpdated,
    setMapDataUpdated,
    mapbox,
    setMapbox,
  };

  return (
    <MapContext.Provider value={mapContextValue}>
      {props.children}
    </MapContext.Provider>
  );
}
