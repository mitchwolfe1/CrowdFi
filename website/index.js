let container = document.getElementById("map-container");
let cW = container.offsetWidth;
let cH = container.offsetHeight;

let iframe = document.getElementById("map-frame");
iframe.height = cH;
iframe.width = cW;