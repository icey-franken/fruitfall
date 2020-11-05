import React, { useState, useRef } from "react";
import BuildMap from "./BuildMap";
import AddLocationForm from "./AddLocationForm";

export default function MapContainer() {
  const [mapbox, setMapbox] = useState(null);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const layerIds = ["clusters", "cluster-count", "unclustered-point"];

  const removeLayers = (map) => {
    // e.preventDefault();
    // e.stopPropagation();
    let visible = true;
    layerIds.forEach((layerId) => {
      const visibility = map.getLayoutProperty(layerId, "visibility");
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
    return visible;
  };

  const [showAddLocation, setShowAddLocation] = useState(false);
  const handleAddLocationClick = (e) => {
    // we tie removal of layers and add location form together
    // this way they're always in sync
    const showForm = !removeLayers(mapbox);
    // change of state here does NOT trigger re-render of map - ok!
    setShowAddLocation(showForm);
  };

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
        />
      ) : null}
      <div className="mapbox-cont">
        <BuildMap setMapbox={setMapbox} setMapboxLoaded={setMapboxLoaded} />
        <div id="mapbox" />
      </div>
    </>
  );
}
