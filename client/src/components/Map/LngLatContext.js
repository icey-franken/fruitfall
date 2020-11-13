import React, { useState } from "react";

export const LngLatContext = React.createContext({
  lng: "",
  lat: "",
  setLngLat: () => {},
  // setLat: () => {},
});

export const LngLatContextProvider = (props) => {
  const setLngLat = (lng, lat) => {
    setLngLatState({...lngLat, lng: lng, lat: lat });
  };
  const initState = {
    lng: "",
    lat: "",
    setLngLat: setLngLat,
  };

  const [lngLat, setLngLatState] = useState(initState);
  const value = {lngLat};
  return (
    <LngLatContext.Provider value={value}>
      {props.children}
    </LngLatContext.Provider>
  );
};
