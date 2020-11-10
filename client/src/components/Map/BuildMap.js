import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
// import "../../../node_modules/mapbox-gl/dist/mapbox-gl.css";
import { accessToken, mapStyle } from "../../config";
import mapboxgl from "mapbox-gl";
import InfoPopup from "./InfoPopup";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
const primary_color = "#11b4da"; //update
const secondary_color = "#fff"; //update
// must have odd number of entries. Color, number, color, etc. Same for radius scale
const circle_color_scale = [
  "#B49EDC",
  50,
  "#C5EBFE",
  250,
  "#A5F8CE",
  750,
  "#FFFD98",
  3000,
  "#FEC9A7",
  15000,
  "#F297C0",
];
// change radius to a step function - LATER
const circle_radius_scale = [
  10,
  50,
  15,
  250,
  20,
  750,
  25,
  3000,
  30,
  15000,
  35,
  50000,
  40,
];

export default function BuildMap({
  setMapbox,
  setMapboxLoaded,
  setSearchLatLon,
  showAddLocation,
  markerInst,
}) {
  // const [viewport, setViewport] = useState({
  //   center: [-94.6859, 46.5],
  //   zoom: [5],
  //   movingMethod: "easeTo",
  //   // maxBounds: [[-98,43.2], [-89.5, 50]]  //I don't care about maxBounds - look whereever you please, data is only in mn
  // });
  const mapData = useRef();

  const loadMap = (map) => {
    const geocoder = new MapboxGeocoder({
      accessToken: accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    });
    map.addControl(geocoder);
    geocoder.on("result", ({ result }) => {
      const el = document.createElement("div");
      el.className = "marker";
      const marker = new mapboxgl.Marker(el, { draggable: true });
      marker.setLngLat(result.center).addTo(map);
      // clear previous marker if it exists
      if (markerInst.current) {
        markerInst.current.remove();
      }
      markerInst.current = marker;
      //this will fill in whatever result user clicks on
      setSearchLatLon([...result.center]);
      // make their search result draggable and set coords in form
      marker.on("dragend", (e) => {
        const coordinates = e.target.getLngLat();
        setSearchLatLon([coordinates.lng, coordinates.lat]);
      });
    });

    //------------------------------ figuring out valid geojson
    // this works!
    const geojson_obj = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            id: "2112",
            type_ids: "61",
            Latitude: "46.874249",
            Longitude: "-96.793518",
            unverified: "FALSE",
            description: "Red Raven Espresso Parlor (in Alley)",
            author: "Lauryn",
            created_at: "2013-02-07 07:11:39 UTC",
            updated_at: "2016-12-06 04:01:03 UTC",
            import_link: "https://fallingfruit.org/imports/44",
            hidden: "FALSE",
          },
          geometry: { type: "Point", coordinates: [-96.793518, 46.874249] },
        },
        {
          type: "Feature",
          properties: {
            id: "2113",
            type_ids: "61",
            Latitude: "46.874187",
            Longitude: "-96.78801",
            unverified: "FALSE",
            description: "Main Ave & 6th St S",
            author: "Lauryn",
            created_at: "2013-02-07 07:11:39 UTC",
            updated_at: "2016-12-08 21:57:28 UTC",
            import_link: "https://fallingfruit.org/imports/44",
            hidden: "FALSE",
          },
          geometry: { type: "Point", coordinates: [-96.78801, 46.874187] },
        },
      ],
    };

    // this does NOT
    const geojson_obj2 = {
      features: [
        {
          geometry: { coordinates: [-96.793518, 46.874249], type: "Point" },
          properties: { id: 2112 },
          type: "Feature",
        },
        {
          geometry: { coordinates: [ -96.78801, 46.874187], type: "Point" },
          properties: { id: 2113 },
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    };

    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
		// add the point_count property to your source data.
		console.log(mapData.current)
		const geojson = JSON.stringify(mapData.current)
		console.log(typeof mapData.current)
		console.log(typeof geojson)
    map.addSource("fruitfall", {
      type: "geojson",
      data: mapData.current,//geojson_obj2, //data, //"./locations_MN.geojson", //change this to come from database
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      // promoteId: 'id'//this moves id from properties into feature id - but it breaks clusters!
      generateId: true, //will this work for clusters and unclustered-points??? YES!
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "fruitfall",
      filter: ["has", "point_count"],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        "circle-color": ["step", ["get", "point_count"], ...circle_color_scale],
        // original circle color
        // "circle-color": [
        //   "step",
        //   ["get", "point_count"],
        //   "#51bbd6",
        //   100,
        //   "#f1f075",
        //   750,
        //   "#f28cb1",
        // ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          ...circle_radius_scale,
        ],
        "circle-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.7,
        ],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "fruitfall",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 14,
        // "text-color": '#FFFFFF',
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "fruitfall",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": primary_color,
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          6,
          4,
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": secondary_color,
        "circle-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.7,
        ],
      },
    });

    // inspect a cluster on click
    map.on("click", "clusters", function (e) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("fruitfall")
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
      const mag = e.features[0].properties;
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
      addPopup(map, coordinates, mag);
    });

    // start cluster hover features----------------
    let featureId = null; //try grouping hover effect for clusters and unclustered points into one variable - we only want one hover effect at a time anyways - WORKS!
    map.on("mousemove", "clusters", function (e) {
      map.getCanvas().style.cursor = "pointer";
      if (e.features.length > 0) {
        if (featureId) {
          map.removeFeatureState({
            source: "fruitfall",
            id: featureId,
          });
        }
        featureId = e.features[0].id;
        // console.log(featureId);
        map.setFeatureState(
          {
            source: "fruitfall",
            id: featureId,
          },
          {
            hover: true,
          }
        );
      }
    });

    map.on("mouseleave", "clusters", function () {
      map.getCanvas().style.cursor = "";
      if (featureId) {
        map.setFeatureState(
          {
            source: "fruitfall",
            id: featureId,
          },
          {
            hover: false,
          }
        );
      }
      featureId = null;
    });
    // end cluster hover features--------------

    // start unclustered point hover features---------------
    map.on("mousemove", "unclustered-point", function (e) {
      map.getCanvas().style.cursor = "pointer";
      if (e.features.length > 0) {
        if (featureId) {
          map.removeFeatureState({
            source: "fruitfall",
            id: featureId,
          });
        }
        featureId = e.features[0].id;
        map.setFeatureState(
          {
            source: "fruitfall",
            id: featureId,
          },
          {
            hover: true,
          }
        );
      }
    });

    map.on("mouseleave", "unclustered-point", function () {
      map.getCanvas().style.cursor = "";
      if (featureId) {
        map.setFeatureState(
          {
            source: "fruitfall",
            id: featureId,
          },
          {
            hover: false,
          }
        );
      }
      featureId = null;
    });
    // end unclustered point hover features----------------

    // RESIZE MAP ON CLICK ADD BUTTON-----------------------
    // 		I gave up on this - not worth the time
    //  next five lines moved to map container
    // const addLocationButton = document.getElementById("add-location-button");
    // addLocationButton.addEventListener("click", (e) => {
    //   // console.log("hits map main");
    // 	map.flyTo({ center: [-94.6859, 46.5], zoom: 5 });
    // });
    // show map coords on click if viewing form
    // map.on('click', function popupOnClick(e) {
    // 	console.log('hits click')
    // 	console.log(showAddLocation)
    // 	if(showAddLocation) {
    // 		console.log('e', e)
    // 	// console.log('map', map)
    // 	console.log(e.lngLat)
    // 	}
    // 	// var coordinates = e.lngLat;
    // 	// 	new mapboxgl.Popup()
    // 	// 		.setLngLat(coordinates)
    // 	// 		.setHTML('you clicked here: <br/>' + coordinates)
    // 	// 		.addTo(map);
    // });
    setMapboxLoaded(true);
  };

  const addPopup = (map, coordinates, info) => {
    const placeholder = document.createElement("div");
    const popup = <InfoPopup info={info} />;
    ReactDOM.render(popup, placeholder);
    new mapboxgl.Popup({ closeButton: false })
      .setDOMContent(placeholder)
      .setLngLat(coordinates)
      .addTo(map);
  };

  useEffect(() => {
		console.log('hits map use effect. Data:', mapData.current)
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: "mapbox",
      style: mapStyle,
      center: [-94.6859, 46.5],
      zoom: 5,
      movingMethod: "easeTo",
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false,
    });
    map.on("load", () => loadMap(map));
    setMapbox(map);
  }, [mapData]);

  useEffect(() => {
		console.log('hits get_data use effect. Data:', mapData)
    async function get_data() {
      const res = await fetch("/api/features/");
      console.log(res);
      const res_data = await res.json();
			console.log(res_data)
      // console.log(res_data)
      // const json_data = JSON.stringify(res_data);
			// setData(res_data);
			mapData.current = res_data
    }
    get_data();
    console.log("data use effect:", mapData);
  }, []);

  return null;
}
