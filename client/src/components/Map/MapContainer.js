import React, { useState, useRef, useEffect } from "react";
import BuildMap from "./BuildMap";
import AddLocationForm from "./LocationForm/AddLocationFormHook";
import { useForm } from "react-hook-form";

import mapboxgl from "mapbox-gl";
export default function MapContainer() {
  const [mapbox, setMapbox] = useState(null);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const searchLatLonRef = useRef(["", ""]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const canvasRef = useRef();
  const markerInst = useRef();
  const layerIds = ["clusters", "cluster-count", "unclustered-point"];

  // include form here so we can pass it to build map to update lat/lon
  const useFormObj = useForm({
    defaultValues: {
      type_ids: "",
      lat: "",
      lng: "",
      description: "",
      season_start: "",
      season_stop: "",
      no_season: false,
      unknown_season: false,
      author: "", //don't have yet
      access: "",
      unverified: false,
      visited: false,
      date_visited: null, //the next four come from second form
      "fruiting-status": 0,
      quality: 0,
      yield: 0,
    },
  });
  const { setValue, clearErrors } = useFormObj;

  const addCrosshair = (canvasRef) => {
    for (let i = 0; i < canvasRef.current.length; i++) {
      canvasRef.current[i].classList.add("crosshair");
    }
  };
  const removeCrosshair = (canvasRef) => {
    for (let i = 0; i < canvasRef.current.length; i++) {
      canvasRef.current[i].classList.remove("crosshair");
    }
  };

  useEffect(() => {
    canvasRef.current = document.querySelectorAll(".mapboxgl-canvas");
  }, [mapboxLoaded]);

  // useRef hook required so that we reference the SAME function in map.on and map.off in useEffect hook
  const mapClickFn = useRef((e) => {
    // remove marker from search on click
    const geocoderMarker = e.target._controls[2].mapMarker;
    if (geocoderMarker) {
      geocoderMarker.remove();
    }
    // remove prev marker on click
    if (markerInst.current) {
      markerInst.current.remove();
    }
    const coordinates = e.lngLat;
    // set coords on click
    setValue("lat", coordinates.lat);
    setValue("lng", coordinates.lng);
    clearErrors(["lat", "lng"]);
    // !!!
    // searchLatLonRef.current = [coordinates.lng, coordinates.lat];
    // create new marker on click
    const el = document.createElement("div");
    el.className = "marker";
    const marker = new mapboxgl.Marker(el, { draggable: true });
    marker.setLngLat(coordinates).addTo(e.target);
    // change cursor back to grabbing on drag
    marker.on("dragstart", () => {
      removeCrosshair(canvasRef);
    });
    // update coords on drag
    marker.on("dragend", () => {
      const coordinates = marker.getLngLat();
      setValue("lat", coordinates.lat);
      setValue("lng", coordinates.lng);
      clearErrors(["lat", "lng"]);

      // !!!
      // searchLatLonRef.current = [coordinates.lng, coordinates.lat];
      addCrosshair(canvasRef);
    });
    // update marker instance to new marker
    markerInst.current = marker;
  });

  const handleAddLocationClick = () => setShowAddLocation(!showAddLocation);

  // visible parameter should be 'visible' or 'none'
  const toggleLayers = (visible) => {
    layerIds.forEach((layerId) => {
      mapbox.setLayoutProperty(layerId, "visibility", visible);
    });
  };

  // toggle map layers and the map click effect based on show add location form state
  useEffect(() => {
    console.log(
      'mapboxLoaded - for "error - style is not done loading:"',
      mapboxLoaded
    );
    if (mapboxLoaded) {
      mapbox.flyTo({ center: [-94.6859, 46.5], zoom: 5 });
      if (showAddLocation) {
        mapbox.on("click", mapClickFn.current);
        toggleLayers("none");
        addCrosshair(canvasRef);
      } else {
        mapbox.off("click", mapClickFn.current);
        toggleLayers("visible");
        if (markerInst.current) {
          markerInst.current.remove();
        }
        // setSearchLatLon([]);
        // !!! don't reset lat lon - just leave it. There won't be a marker but that's fine
        // 		setValue('lat', coordinates.lat)
        // setValue('lng', coordinates.lng)
        removeCrosshair(canvasRef);
      }
    }
  }, [showAddLocation]);

  // !!!!
  // useEffect(() => {
  //   console.log(searchLatLonRef);
  // }, [searchLatLonRef.current]);

  return (
    <div className="content-cont">
      {mapboxLoaded ? ( //do this conditionally to reduce number of rerenders
        <AddLocationForm
          handleAddLocationClick={handleAddLocationClick}
          setShowForm={setShowAddLocation}
          handleFormSubmitClick={handleAddLocationClick}
          // searchLatLonRef={searchLatLonRef}
          show={showAddLocation}
          useFormObj={useFormObj}
        />
      ) : null}
      <div className="mapbox-cont">
        <button
          id="add-location-button"
          className={`btn add-location__btn ${
            showAddLocation ? "add-location__btn--hide" : ""
          }`}
          name={showAddLocation.toString()}
          onClick={handleAddLocationClick}
          // hide button until layers loaded
          style={{ display: `${mapboxLoaded ? "" : "none"}` }}
        >
          Add Location
        </button>
        <BuildMap
          setMapbox={setMapbox}
          setMapboxLoaded={setMapboxLoaded}
          setValue={setValue}
          clearErrors={clearErrors}
          // searchLatLonRef={searchLatLonRef}
          // showAddLocation={showAddLocation}
          markerInst={markerInst}
        />
        <div id="mapbox" />
      </div>
    </div>
  );
}
