import React, { useState, useRef, useEffect } from "react";
import BuildMap from "./BuildMap";
import AddLocationForm from "./LocationForm/AddLocationFormHook";

import mapboxgl from "mapbox-gl";
export default function MapContainer() {
  const [mapbox, setMapbox] = useState(null);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const [searchLatLon, setSearchLatLon] = useState([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const canvasRef = useRef();
  const markerInst = useRef();
  const layerIds = ["clusters", "cluster-count", "unclustered-point"];

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
    setSearchLatLon([coordinates.lng, coordinates.lat]);
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
      setSearchLatLon([coordinates.lng, coordinates.lat]);
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
        setSearchLatLon([]);
        removeCrosshair(canvasRef);
      }
    }
  }, [showAddLocation]);

  useEffect(() => {
    console.log(searchLatLon);
  }, [searchLatLon]);



  return (
    <div className="content-cont">
      <AddLocationForm
				handleAddLocationClick={handleAddLocationClick}
        setShowForm={setShowAddLocation}
        handleFormSubmitClick={handleAddLocationClick}
        searchLatLon={searchLatLon}
        show={showAddLocation}
      />
      <div
        className="mapbox-cont"
      >
        <button
          id="add-location-button"
          className={`btn add-location__btn ${showAddLocation ? 'add-location__btn--hide' : ''}`}
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
          setSearchLatLon={setSearchLatLon}
          // showAddLocation={showAddLocation}
          markerInst={markerInst}
        />
        <div id="mapbox" />
      </div>
    </div>
  );
}
