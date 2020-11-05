import React, { useState, useRef, useEffect } from "react";
import BuildMap from "./BuildMap";
import AddLocationForm from "./AddLocationForm";
import mapboxgl from "mapbox-gl";
export default function MapContainer() {
  const [mapbox, setMapbox] = useState(null);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const layerIds = ["clusters", "cluster-count", "unclustered-point"];

  const [searchLatLon, setSearchLatLon] = useState([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [popupInst, setPopupInst] = useState();
  const markerInst = useRef();
  const geocoderMarkerInst = useRef();

  // useRef hook required so that we reference the SAME function in map.on and map.off in useEffect hook
  const mapClickFn = useRef((e) => {
		// remove marker from search on click
		const geocoderMarker = e.target._controls[2].mapMarker
		if (geocoderMarker){
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
    const marker = new mapboxgl.Marker({ draggable: true });
    marker.setLngLat(coordinates).addTo(e.target);
    // update coords on drag
    marker.on("dragend", () => {
      const coordinates = marker.getLngLat();
      setSearchLatLon([coordinates.lng, coordinates.lat]);
    });
    // update marker instance to new marker
    markerInst.current = marker;
  });

  const geocoderMoveFn = useRef((e) => {
    console.log("hits geocoder move fn");
    const geocoderMarker = e.target;
    console.log(geocoderMarker);
    if (geocoderMarker) {
      let coordinates = geocoderMarker.getLngLat();
      setSearchLatLon([coordinates.lng, coordinates.lat]);
      console.log("hits dragend");
      geocoderMarkerInst.current = geocoderMarker;
    }
  });

  // visible parameter should be 'visible' or 'none'
  const toggleLayers = (visible) => {
    layerIds.forEach((layerId) => {
      mapbox.setLayoutProperty(layerId, "visibility", visible);
    });
  };

  useEffect(() => {
    console.log(mapboxLoaded, mapbox);
    if (mapboxLoaded && mapbox) {
      let geocoderMarker;
      try {
        geocoderMarker = mapbox._controls[2].mapMarker;
      } catch (e) {
        console.log("hits catch", e);
      }

      geocoderMarkerInst.current = geocoderMarker;
      console.log(geocoderMarkerInst);
    }
  }, [mapbox, mapboxLoaded]);

  useEffect(() => {
    console.log("geocoder marker inst changed");
  }, [geocoderMarkerInst.current]);
  // toggle map layers and the map click effect based on show add location form state
  useEffect(() => {
    if (mapboxLoaded) {
      // const geocoder = mapbox._controls[2];
      // console.log(geocoder);
      console.log(mapbox);

      // const geocoderMarker = mapbox._controls[2].mapMarker;
      // geocoderMarkerInst.current = geocoderMarker;
      // console.log(geocoderMarkerInst.current)

      mapbox.flyTo({ center: [-94.6859, 46.5], zoom: 5 });
      const geocoderMarker = geocoderMarkerInst.current;
      if (showAddLocation) {
        mapbox.on("click", mapClickFn.current);
				toggleLayers("none");
				console.log(geocoderMarker);
        if (geocoderMarker) {
          geocoderMarker.on("dragend", geocoderMoveFn.current);
        }
      } else {
        mapbox.off("click", mapClickFn.current);
        if (markerInst.current) {
          markerInst.current.remove();
        }
        if (geocoderMarker) {
          geocoderMarker.off("dragend", geocoderMoveFn.current);
        }
        toggleLayers("visible");
        setSearchLatLon([]);
      }
    }
  }, [showAddLocation]);

  useEffect(() => {
    console.log(searchLatLon);
  }, [searchLatLon]);

  const handleAddLocationClick = () => setShowAddLocation(!showAddLocation);

  return (
    <>
      <button
        id="add-location-button"
        className="btn add-location__btn"
        name={showAddLocation.toString()}
        onClick={handleAddLocationClick}
        // hide button until layers loaded
        style={{ display: `${mapboxLoaded ? "" : "none"}` }}
      >
        {showAddLocation ? "Close" : "Add Location"}
      </button>
      {showAddLocation ? (
        <AddLocationForm
          style={{ display: `${showAddLocation ? "" : "none"}` }}
          setShowForm={setShowAddLocation}
          handleFormSubmitClick={handleAddLocationClick}
          searchLatLon={searchLatLon}
        />
      ) : null}
      <div className="mapbox-cont">
        <BuildMap
          setMapbox={setMapbox}
          setMapboxLoaded={setMapboxLoaded}
          setSearchLatLon={setSearchLatLon}
					showAddLocation={showAddLocation}
					markerInst={markerInst}
        />
        <div id="mapbox" />
      </div>
    </>
  );
}
