var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var map = L.map("map", {
  center: [43.59348894770488, -92.94430817142192],
  zoom: 16,
    minZoom: 16,
   maxZoom: 18,
    maxBounds: [
    [42.0, -93.0], // southwest corner
    [46.0, -87.0]  // northeast corner
  ],
  layers: imagery
});

fetch('Home_field_centroids2.geojson')
  .then(res => res.json())
  .then(data => {     
    L.geoJSON(data, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 4,
      color: '#0066ff',
      weight: 2,
      fillColor: '#ffffff',
      fillOpacity: 1
    });
  },

  onEachFeature: function (feature, layer) {
    // Display the centroid's attribute values
    const properties = feature.properties;

    // Change 'id' to your actual attribute field name
    const value = properties.id;

    layer.bindTooltip(String(value), {
      permanent: true,
      direction: 'center',
      className: 'centroid-label'
    });
  }
}).addTo(map);


    // Display acreage in legend
    const acres = data.properties?.acres || 'N/A';
    document.getElementById('acreage-value').innerHTML = `<b>${acres} acres</b>`;
  })
  .catch(err => console.log('No field boundary found'));

// Home Button //
var homeCenter = map.getCenter();

var homeZoom = map.getZoom();

L.easyButton(('<img src="Home_icon_black.png", height=70%>'), function () {
  map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

// Locate control //
console.log(L.control.locate);
L.control.locate().addTo(map);




// area of concern?
// in depth about tab - change description box in field1
// soil sample and acres do not load inside of mobile tab

// THINGS TO ADD LATER
// add DSM for elevation and wet spot detection (need cloud storage and fetch)
// add RGB (need cloud storage and fetch)
// add other soil properties 

// ArcGIS Pro notes
// add GeoJSON to GDB and do JSON to Feature 
// add soil sample data and locations 
// locations created using the fishnet tool (2.5 acres x 2.5 acreas) on the JSON feature and then clipping the dots to the field extent 
// output as GeoJSON so locations can be added to webmap
// add join fishnet locations to soil sample data
// perform a kriging interpolation on soil sample data and locations
// add NDVI from pix4D and clip raster to field extent (might need to resample or figure out cloud storage)
// export rasters inside of clip (both NDVI and pH) (from ArcGIS Pro save it outside of GDB and add .tif at the end)
