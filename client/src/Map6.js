import React, { useState, useRef } from "react";
import { randomPoint } from "@turf/random";
// import MapGL, { Source, Layer, easeTo, onEnter, Feature } from "@urbica/react-map-gl";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
import { accessToken, mapStyle } from "./config";
// this is what your points need to look like:
import MapboxGlMapHooks from "./Map4";
// import { Feature } from "react-mapbox-gl";
import ReactMapboxGl, { Layer, Feature, Source, Popup } from "react-mapbox-gl";
import mapboxgl from "mapbox-gl";
import InfoPopup from "./components/Map/InfoPopup";

const data = {
  type: "FeatureCollection",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [
    {
      type: "Feature",
      properties: {
        id: "ak16994521",
        mag: 2.3,
        time: 1507425650893,
        felt: null,
				tsunami: 0,
				onClick: (e)=>{console.log(e)}
      },
      geometry: { type: "Point", coordinates: [-96, 46.5] },
    },
    {
      type: "Feature",
      properties: {
        id: "ak16994519",
        mag: 1.7,
        time: 1507425289659,
        felt: null,
        tsunami: 0,
      },
      geometry: { type: "Point", coordinates: [-95.5, 46.5] },
    },
    {
      type: "Feature",
      properties: {
        id: "ak16994517",
        mag: 1.6,
        time: 1507424832518,
        felt: null,
        tsunami: 0,
      },
      geometry: { type: "Point", coordinates: [-95, 46.5] },
    },
  ],
};

export default function MapTry() {
	const [points, setPoints] = useState(randomPoint(100));
	const [showPopup, setShowPopup] = useState(false)
	// const showPopupRef = useRef(false)
	const popupInfoRef = useRef()
	const popupCoordinatesRef = useRef()
	const [viewport, setViewport] = useState({
    center: [-94.6859, 46.5],
    zoom: [5],
    movingMethod: "easeTo",
    // maxBounds: [[-98,43.2], [-89.5, 50]]  //I don't care about maxBounds - look whereever you please, data is only in mn
  });

  const addPoints = () => {
    const randomPoints = randomPoint(100);
    const newFeatures = points.features.concat(randomPoints.features);
    const newPoints = { ...points, features: newFeatures };
    setPoints(newPoints);
    console.log(points);
  };

  const handleClusterClick = (e) => {
    console.log(e);
    console.log(e.target._canvas);

    // const features = queryRenderedFeatures(e.point, {
    //   layers: ["clusters"],
    // });
    // const clusterId = features[0].properties.cluster_id;

    // map.getSource("earthquakes").getClusterExpansionZoom(clusterId, function (err, zoom) {
    //     if (err) return;

    //     map.easeTo({
    //       center: features[0].geometry.coordinates,
    //       zoom: zoom,
    //     });
    //   });
  };
  const handleMouseEnter = (e) => {
    console.log(e);
    const canvas = e.target._canvas;
    canvas.style.cursor = "pointer";
  };
  const handleMouseLeave = (e) => {
    const canvas = e.target._canvas;
    canvas.style.cursor = "";
  };

  function loadStuff(map) {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource("earthquakes", {
      type: "geojson",
      // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
      // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
      data: data,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "earthquakes",
      filter: ["has", "point_count"],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "earthquakes",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "earthquakes",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    // inspect a cluster on click
    map.on("click", "clusters", function (e) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("earthquakes")
        .getClusterExpansionZoom(clusterId, function (err, zoom) {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on("click", "unclustered-point", function (e) {
			const coordinates = e.features[0].geometry.coordinates.slice();
      // change this to the info - the popup will be an info component
      const mag = e.features[0].properties.mag;
      let tsunami;

      if (e.features[0].properties.tsunami === 1) {
        tsunami = "yes";
      } else {
        tsunami = "no";
      }

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      // const popup = InfoPopup(coordinates);
			// console.log(popup);
			popupCoordinatesRef.current = coordinates
			popupInfoRef.current = mag
			// showPopupRef.current = true
			// console.log(showPopupRef)
			setShowPopup(true)
      // map.addTo(popup)
      // new mapboxgl.Popup()
      //   .setLngLat(coordinates)
      //   .setHTML("magnitude: " + mag + "<br>Was there a tsunami?: " + tsunami)
      //   .addTo(map);
    });

    map.on("mouseenter", "clusters", function () {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", function () {
      map.getCanvas().style.cursor = "";
    });
  }

  const mapProperties = {
    // version: 8,
    // name: "Mapbox Streets",
    // "sprite": "mapbox://sprites/mapbox/streets-v8",
    // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    // sources: {},
    // layers: [],
    // ...viewport
  };

  const Map = ReactMapboxGl({
    accessToken,
    // container: 'map',
    // ...mapProperties,
  });
	// console.log(showPopupRef)
  return (
    <>
      <button onClick={addPoints}>+100 points</button>
      <Map
        className="mapbox"
        style={mapStyle}
        onStyleLoad={loadStuff}
        // mapStyle={mapStyle}
        // accessToken={accessToken}
        onViewportChange={setViewport}
        {...viewport}
        // renderChildrenInPortal={true}
      >
				<InfoPopup showPopup={showPopup} coordinates={popupCoordinatesRef.current} info={popupInfoRef.current} setShowPopup={setShowPopup}  />
			</Map>
    </>
  );
}
