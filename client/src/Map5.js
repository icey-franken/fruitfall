import React, { useState } from "react";
import { randomPoint } from "@turf/random";
// import MapGL, { Source, Layer, easeTo, onEnter, Feature } from "@urbica/react-map-gl";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
import { accessToken, mapStyle } from "./config";
// this is what your points need to look like:
import MapboxGlMapHooks from "./Map4";
// import { Feature } from "react-mapbox-gl";
import ReactMapboxGl, { Layer, Feature, Source } from "react-mapbox-gl";

export default function MapTry() {
  const geojsonData = {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            onMouseEnter: (e) => {
              console.log(e);
            },
          },
          geometry: {
            type: "Point",
            coordinates: [-95, 46.5],
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [-95.5, 46.5],
          },
        },
      ],
    },
  };

  // const geojsonData = {
  //   type: "geojson",
  //   data: {
  //     type: "Feature",
  //     geometry: {
  //       type: "Point",
  //       coordinates: [-95, 46.5],
  //     },
  //     properties: {
  //       // onMouseEnter: (e) => {
  //       //   console.log(e);
  //     },
  //   },
  // };

  const [points, setPoints] = useState(randomPoint(100));

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
      data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
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
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      var clusterId = features[0].properties.cluster_id;
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
      var coordinates = e.features[0].geometry.coordinates.slice();
      var mag = e.features[0].properties.mag;
      var tsunami;

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
    sources: {},
		layers: [],
		...viewport
  };

  const Map = ReactMapboxGl({
		accessToken,
		conatiner: 'map',
    style: mapStyle,

    ...mapProperties,
  });

  return (
    <>
      <button onClick={addPoints}>+100 points</button>
      <Map
        className="mapbox"
				style={mapStyle}
				onStyleLoad={loadStuff}
        // mapStyle={mapStyle}
        // accessToken={accessToken}
        // onViewportChange={setViewport}
        {...viewport}
        // renderChildrenInPortal={true}
      />
    </>
  );
}
