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
  // const geojsonData = {
  //   type: "geojson",
  //   data: {
  //     type: "FeatureCollection",
  //     features: [
  //       {
  //         type: "Feature",
  //         properties: {
  //           onMouseEnter: (e) => {
  //             console.log(e);
  //           },
  //         },
  //         geometry: {
  //           type: "Point",
  //           coordinates: [-95, 46.5],
  //         },
  //       },
  //       {
  //         type: "Feature",
  //         properties: {},
  //         geometry: {
  //           type: "Point",
  //           coordinates: [-95.5, 46.5],
  //         },
  //       },
  //     ],
  //   },
  // };

  const geojsonData = {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-95, 46.5],
      },
      properties: {
        // onMouseEnter: (e) => {
        //   console.log(e);
      },
    },
  };

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

  const Map = ReactMapboxGl({ accessToken });

  return (
    <>
      <button onClick={addPoints}>+100 points</button>
      <Map
        className="mapbox"
        style={mapStyle}
        // mapStyle={mapStyle}
        // accessToken={accessToken}
        onViewportChange={setViewport}
        {...viewport}
        renderChildrenInPortal={true}
      >
        <Source
          id="points"
          // type="geojson"
          geoJsonSource={geojsonData}
          // // data={data}
          // cluster={true}
          // clusterMaxZoom={13} //point at which things cluster
          // clusterRadius={50} //
        />
        {/* cluster layer */}
        <Layer
          id="clusters"
          // onMouseEnter={handleMouseEnterCluster}
          // onMouseLeave={()=>getCanvas}
          // onClick={handleClusterClick}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
          type="circle"
          source="points"
          filter={["has", "point_count"]}
          paint={{
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          }}
        >
          {/* {data.features.map((feature, idx) => (
            <Feature
              key={idx}
              coordinates={feature.geometry.coordinates}
              properties={feature.properties}
            />
          ))} */}
        </Layer>
        <Layer
          id="cluster-count"
          type="symbol"
          source="points"
          filter={["has", "point_count"]}
          layout={{
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          }}
        >
          <Feature coordinates={[-95, 46.5]}></Feature>
        </Layer>
        {/* unclustered point layer */}
        <Layer
          id="unclustered-point"
          type="circle"
          source="points"
          filter={["!", ["has", "point_count"]]}
          paint={{
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          }}
        />
        {/* <Layer
          id="points"
          type="circle"
          source="points"
          paint={{
            "circle-radius": 6,
            "circle-color": "#1978c8",
          }}
        /> */}
      </Map>
    </>
  );
}
