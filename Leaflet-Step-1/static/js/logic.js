function markerSize(mag) {
  return mag *10000;
}
// Function that will determine the color of a neighborhood based on the borough it belongs to
function colors(points)
{
  color = "";
  if (points < 1) {
    color = "#3ADF00";
  }
  else if (points < 2) {
    color = "#D0FA58";
  }
  else if (points < 3) {
    color = "#FFBF00";
  }
  else if (points < 4) {
    color = "#FF8000";
  }
  else if (points < 5) {
    color = "#FE642E";
  }
  else {
    color = "red";
  }

return color

}


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createMap function
  createMap(data.features);
});

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function bindPopMaker(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}
function createMap(earthquakeData) {
   
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the bindPopMaker function once for each piece of data in the array
    //
    // Method 1 Using L.geoJSON to create the marker layer group.
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: bindPopMaker
    });

    // Create the LayerGroup without the L.geoJson

    // Loop through locations and markers elements
      EarthquakeMarkers= earthquakeData.map((feature) =>
                    //Yes, the geojson 'FORMAT' stores it in reverse, for some reason. (L.geojson parses it as [lat,lng] for you)
                     //lat                         //long  
          L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
              stroke: true,
              weight: .5,
              fillOpacity: 0.95,
              color: "black",
              fillColor: colors(feature.properties.mag),
              radius: markerSize(feature.properties.mag)
          })
          .bindPopup("<h2> Magnitude : " + feature.properties.mag +
          "</h2><hr><h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
      )

      // Add the earthquakes layer to a marker cluster group.
      var earthquakes=L.layerGroup(EarthquakeMarkers)
      

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


var legend = L.control({position: 'bottomright'});
legend.onAdd=function(map){
    var div=L.DomUtil.create('div','legend');
    var labels=["0-1","1-2","2-3","3-4","4-5","5+"];
    var limits = [.99,1.99,2.99,3.99,4.99,5];
    div.innerHTML='<div><b>Legend</b></div';
    for(var i=0; i <limits.length; i++){
        div.innerHTML+='<i style="background:'+colors(limits[i])+' ">&nbsp;</i>&nbsp;&nbsp;'
        +labels[i]+'<br/>';
    }
    return div;
};
legend.addTo(myMap);

};
