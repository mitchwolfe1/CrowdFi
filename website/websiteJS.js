

  // This example requires the Visualization library. Include the libraries=visualization
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">
  //nodejs
  function getPoints() {
    return [
        new google.maps.LatLng(37.785360, -122.439952),
         new google.maps.LatLng(37.785715, -122.440030),
         new google.maps.LatLng(37.786117, -122.440119),
         new google.maps.LatLng(37.786564, -122.440209),
         new google.maps.LatLng(37.786905, -122.440270),
         new google.maps.LatLng(37.786956, -122.440279)


    ];
  }
  var msg;
//  const WebSocket = require('ws');
  var ws = new WebSocket("ws://35.233.148.65:1337");
  ws.onopen = function(){
      console.log("Connected to websocket ");
      ws.send("test");
  }
  ws.onclose = function(){
      alert("You have been disconnected from the websocket!");
  };
  ws.onmessage = function(payload) {
      console.log(payload.data);
      msg = payload.data;

  };



  //regular js
  var map, heatmap;

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 37.775, lng: -122.434},
      mapTypeId: 'satellite'
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: getPoints(),
      map: map
    });
  }

  function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
  }

  function changeGradient() {
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
  }

  function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
  }

  function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
  }

  // Heatmap data: 500 Points
