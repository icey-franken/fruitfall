import React, { useState, useRef } from "react";
import MapMain from "./MapMain";
import AddLocationForm from "./AddLocationForm";

export default function MapContainer() {
  // const [mapbox, setMapbox] = useState(null);
  const mapbox = useRef(null);

  const layerIds = ["clusters", "cluster-count", "unclustered-point"];

  const removeLayers = (map) => {
    // e.preventDefault();
    // e.stopPropagation();
    let visible = true;
    layerIds.forEach((layerId) => {
      const visibility = map.getLayoutProperty(layerId, "visibility");
      console.log(visibility);
      // or undefined because that is initial value. Easier than changing visibility
      if (visibility === "visible" || visibility === undefined) {
        map.setLayoutProperty(layerId, "visibility", "none");
        //  this.className = '';
        visible = false;
      } else {
        //  this.className = 'active';
        map.setLayoutProperty(layerId, "visibility", "visible");
      }
      // map.resize();
    });
    console.log("visible?", visible);
    return visible;
    // toggle layer visibility by changing the layout object's visibility property
  };
  const [mapboxClass, setMapboxClass] = useState("mapbox-full");
  const [showAddLocation, setShowAddLocation] = useState(false);
  const handleAddLocationClick = (e) => {
    console.log("hits map container");
    // we tie removal of layers and add location form together
    const showForm = !removeLayers(mapbox.current);
    console.log(e.target.name);
    // setMapboxClass()

    // change of state here does NOT trigger re-render of map - ok!
    setShowAddLocation(showForm);
  };

  // add something so that button doesn't render until styles are loaded

  return (
    <>
      {/* <div className={`${showAddLocation ? "add-location__view" : ""}`}> */}
      <button
        id="add-location-button"
        name={showAddLocation.toString()}
        onClick={handleAddLocationClick}
      >
        Add Location
      </button>
      {showAddLocation ? <AddLocationForm /> : null}
      <div className="mapbox-cont">
        {/* <div className="full-mapbox"> */}
        <MapMain mapbox={mapbox} />
        <div
          id="mapbox"
          // className={mapboxClass}
          // className={`mapbox ${
          //   showAddLocation ? "add-location__mapbox" : "full-mapbox"
          // }`}
          // style={mapStyle}
          // onStyleLoad={addingLocation ? null : loadMap}
          // onViewportChange={setViewport}
          // {...viewport}
          // renderChildrenInPortal={true}
        ></div>
        {/* </div> */}
      </div>
    </>
  );
}
