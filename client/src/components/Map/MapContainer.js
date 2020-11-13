import React, { useState, useRef, useEffect, useContext } from "react";
import BuildMap from "./BuildMap";
import AddLocationForm from "./LocationForm/AddLocationFormHook";
import { LngLatContext } from "./LngLatContext";
import mapboxgl from "mapbox-gl";

const MapContainer = React.memo(({setLngLat}) => {
  const [mapbox, setMapbox] = useState(null);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const canvasRef = useRef();
  const markerInst = useRef();
  const layerIds = ["clusters", "cluster-count", "unclustered-point"];

  // const { lngLatContext } = useContext(LngLatContext);

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
  // useEffect(() => {
  //   console.log(
  //     "map container use effect - calling setLngLat considered update"
  //   );
	// }, [lngLatContext]);
	// useEffect(() => {
  //   console.log(
  //     "map container use effect - setting lng considered update"
  //   );
  // }, [lngLat.lng]);
	// useEffect(() => {
  //   console.log(
  //     "map container use effect - setting lat considered update"
  //   );
  // }, [lngLat.lat]);

	useEffect(() => {
    console.log("map container use effect - calling mapbox or setMapbox");
  }, [mapbox, setMapbox]);
  useEffect(() => {
    console.log(
      "map container use effect - calling mapboxLoaded or setMapboxLoaded"
    );
  }, [mapboxLoaded, setMapboxLoaded]);
  useEffect(() => {
    console.log(
      "map container use effect - calling showAddLocation or setShowAddLocation"
    );
  }, [showAddLocation, setShowAddLocation]);
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
    setLngLat(coordinates.lng, coordinates.lat);
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
      setLngLat(coordinates.lng, coordinates.lat);
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
        removeCrosshair(canvasRef);
      }
    }
  }, [showAddLocation]);

  // !!!!
  // useEffect(() => {
  //   console.log(searchLatLonRef);
  // }, [searchLatLonRef.current]);
  console.log("map container re-rendered");
  return (
    <div className="content-cont">
      {mapboxLoaded ? ( //do this conditionally to reduce number of rerenders
        <AddLocationForm
          handleAddLocationClick={handleAddLocationClick}
          setShowForm={setShowAddLocation}
          handleFormSubmitClick={handleAddLocationClick}
          // searchLatLonRef={searchLatLonRef}
          // lngLatRef={lngLatRef}
          show={showAddLocation}
          // useFormObj={useFormObj}
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
					setLngLat={setLngLat}
          // updateLngLat={updateLngLat}
          // showAddLocation={showAddLocation}
          markerInst={markerInst}
        />
        <div id="mapbox" />
      </div>
    </div>
  );
});
export default MapContainer;
