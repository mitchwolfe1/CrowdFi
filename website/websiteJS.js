

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
  function getPoints1() {
    return [
        new google.maps.LatLng(37.785360, -122.439952),
         new google.maps.LatLng(37.785715, -122.440030),
    ];
  }

  //regular js
  var map, heatmap;
  function updateMap(){
    for(var i = 0; i < 1000; i++){
      console.log(i);
      heatmap.set('data', 
        [
          new google.maps.LatLng(37.785360, -122.439952+i),
          new google.maps.LatLng(37.785715, -122.440030+i),
          new google.maps.LatLng(37.786117, -122.440119+i),
          new google.maps.LatLng(37.786564, -122.440209+i),
          new google.maps.LatLng(37.786905, -122.440270+i),
          new google.maps.LatLng(37.786956, -122.440279+i)
      ]);
    }
  }

  function updateMap2(){
    heatmap.set('data', 
      [
         new google.maps.LatLng(37.786905, -122.440270),
         new google.maps.LatLng(37.786956, -122.440279)


    ]);
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 37.775, lng: -122.434},
      mapTypeId: 'satellite'
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: getPoints1(),
      map: map
    });

  }
  


  // Heatmap data: 500 Points
