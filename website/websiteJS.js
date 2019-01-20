
var ws = new WebSocket("ws://35.233.148.65:1337");



var map, pointarray, heatmap;
 
 
function initMap() {
  // the map's options
  var mapOptions = {
    zoom: 30,
    center: new google.maps.LatLng(36.996852, -122.051734),
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    tilt: 0
  };
 
  // the map and where to place it
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
 
 
  // what data for the heatmap and how to display it
  heatmap = new google.maps.visualization.HeatmapLayer({
    radius: 50
  });
 
  // placing the heatmap on the map
  heatmap.setMap(map);
}

function updatemap(arr){ // [lat, lon, weight]
  arr=[[36.996852, -122.051734, 10]]



  var mapArr = [];
  for(var i = 0; i < arr.length; i++){
    mapArr.push({location: new google.maps.LatLng(arr[i][0], arr[i][1]), weight:arr[i][2]});
  }
  console.log(mapArr);
  //var pointArray = new google.maps.MVCArray(mapArr);
  heatmap.set('data', mapArr);
}


ws.onopen = function(){
    console.log("Connected to websocket ");
}
ws.onclose = function(){
    alert("You have been disconnected from the websocket!");
};
ws.onmessage = function(payload) {
    console.log(payload.data);
    updatemap(JSON.parse(payload.data))
};


// as soon as the document is ready the map is initialized
google.maps.event.addDomListener(window, 'load', initialize);