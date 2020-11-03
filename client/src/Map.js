// import React from 'react'
// import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

// const Map = ReactMapboxGl({
//   accessToken,
// });

// // in render()
// export default function TryMap() {
//   return (
//     <Map
//       style={{mapbox:"//styles/mapbox/streets-v9"}}
//       containerStyle={{
//         height: "100vh",
//         width: "100vw",
//       }}
//     >
//       <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
//         <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
//       </Layer>
//     </Map>
//   );
// }

import React, { Component } from "react";
import ReactMap from "react-mapbox-gl";

const accessToken = process.env.REACT_APP_ACCESS_TOKEN;
const style = "mapbox://styles/mapbox/outdoors-v11";

const Map = ReactMap({
  accessToken,
});

const mapStyle = {
  height: "80vh",
  width: "90vw",
};

export default function TryMap() {
  console.log(accessToken);
  return <Map style={style} containerStyle={mapStyle} />;
}
