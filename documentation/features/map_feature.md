# Map Feature

## Google Maps API

### Maps javascript API [DOCS](https://developers.google.com/maps/documentation/javascript/overview)

- format data [like so](https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson)

"Add an interactive map to your website. Customize it with your own content and imagery."

- geocoding api comes along with maps javascript api [geocoding docs](https://developers.google.com/maps/documentation/javascript/geocoding)


- custom overlays and ground overlays in maps javascript api to add labels to pins

- heatmap layer for pin density?



- markers for points on map [docs](https://developers.google.com/maps/documentation/javascript/markers#introduction)
- info window with maxWidth for info box [docs](https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple-max)


- clustering markers [SO](https://stackoverflow.com/questions/3548920/google-maps-api-v3-multiple-markers-on-exact-same-spot)
- clustering spiderfier repo - I don't think this is what I want but it could be cool [GH](https://github.com/jawj/OverlappingMarkerSpiderfier)
- marker clustering [docs](https://developers.google.com/maps/documentation/javascript/marker-clustering)
  - THIS IS THE GUY



~~### Geocoding API~~

"Convert addresses to geographic coordinates or the reverse."

- we will use this to convert between addresses and lat/lon coords

~~### Geolocation API~~ this is for cell phones. Worry about this later


"Return the location of a device without relying on GPS, using location data from cell towers and WiFi nodes."

- we will use this for the "zoom to me" button on the header - get user's location
