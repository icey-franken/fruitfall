import React, { useState, useRef, useEffect } from "react";
import BuildMap from "./BuildMap";
import AddLocationForm from "./AddLocationForm";
import mapboxgl from "mapbox-gl";
export default function MapContainer() {
  const [mapbox, setMapbox] = useState(null);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const layerIds = ["clusters", "cluster-count", "unclustered-point"];

  const [searchLatLon, setSearchLatLon] = useState([]);

  function popupOnClick(e) {
    console.log("e", e);
    // console.log('map', map)
    console.log(e.lngLat);
    // var coordinates = e.lngLat;
    // 	new mapboxgl.Popup()
    // 		.setLngLat(coordinates)
    // 		.setHTML('you clicked here: <br/>' + coordinates)
    // 		.addTo(map);
  }

  const toggleLayers = (map, showLayers) => {
    // e.preventDefault();
    // e.stopPropagation();
    map.on("click", (e) => {
      console.log("hits click", showLayers);
      if (!showLayers) {
        console.log("e", e);
        // console.log('map', map)
        console.log(e.lngLat);
        console.log("hits if");
      } else {
        console.log("hits else");
      }
      // var coordinates = e.lngLat;
      // 	new mapboxgl.Popup()
      // 		.setLngLat(coordinates)
      // 		.setHTML('you clicked here: <br/>' + coordinates)
      // 		.addTo(map);
    });

    layerIds.forEach((layerId) => {
      // const visibility = map.getLayoutProperty(layerId, "visibility");
      if (showLayers === true) {
        map.setLayoutProperty(layerId, "visibility", "visible");
      } else {
        map.setLayoutProperty(layerId, "visibility", "none");
      }
    });
	};
  const [showAddLocation, setShowAddLocation] = useState(false);

	useEffect(()=>{
		if(mapbox){
			toggleLayers(mapbox, showAddLocation)
		}
		// setShowAddLocation(!showAddLocation)
	}, [showAddLocation])

  const handleAddLocationClick = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    if (showAddLocation === true) {
      // toggleLayers(mapbox, true);
      setShowAddLocation(false);
    } else {
      // toggleLayers(mapbox, false);
      setShowAddLocation(true);
    }
    // we tie removal of layers and add location form together
    // this way they're always in sync

    // const showForm = toggleLayers(mapbox);
    // // change of state here does NOT trigger re-render of map - ok!
    // setShowAddLocation(showForm);
  };
  console.log(searchLatLon);

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
        />
        <div id="mapbox" />
      </div>
    </>
  );
}
