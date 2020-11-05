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

  // function popupOnClick(e) {
  //   console.log("e", e);
  //   // console.log('map', map)
  //   console.log(e.lngLat);
  //   // const coordinates = e.lngLat;
  //   // 	new mapboxgl.Popup()
  //   // 		.setLngLat(coordinates)
  //   // 		.setHTML('you clicked here: <br/>' + coordinates)
  // 	// 		.addTo(map);
  // }
  const [popupInst, setPopupInst] = useState();
  const mapClick = (e) => {
    console.log("hits mapclick function. e:", e);
    const coordinates = e.lngLat;
    // // if (!popupInst) {
    console.log("mapclick function - mapbox:", mapbox);
		const popup = new mapboxgl.Popup();
		popup
      .setLngLat(coordinates)
      .setHTML("you clicked here: <br/>" + coordinates)
      .addTo(e.target);
    setPopupInst(popup);
    // }
  };
  const mapClickFn = useRef(mapClick);

  // attmept at singleton pattern
  // const mapClickInstance = {
  // 	mapClick: GARBAGE
  // }
  console.log(mapClickFn);
  useEffect(() => {
    console.log("hits use effect");
    console.log(mapbox);
    if (mapbox) {
      mapbox.flyTo({ center: [-94.6859, 46.5], zoom: 5 });
      if (showAddLocation) {
        console.log("hits use effect if. mapbox:", mapbox);
        mapbox.on("click", mapClickFn.current);
        toggleLayers("none");
      } else {
        mapbox.off("click", mapClickFn.current);
        popupInst.remove();
        toggleLayers("visible");
      }
    }
  }, [showAddLocation]);

  const toggleLayers = (visible) => {
    layerIds.forEach((layerId) => {
      mapbox.setLayoutProperty(layerId, "visibility", visible);
    });
  };

  const handleAddLocationClick = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    console.log(
      "hits handle add location click - showAddLocation:",
      showAddLocation
    );
    setShowAddLocation(!showAddLocation);
  };

  // console.log(searchLatLon);

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
