const WebSocket = require('ws');
var ws = new WebSocket("ws://35.233.148.65:1337");
ws.onopen = function(){
    console.log("Connected to websocket ");
}
ws.onclose = function(){
    alert("You have been disconnected from the websocket!");
};
ws.onmessage = function(payload) {
    console.log(payload.data);
    console.log(pointsarray);
};
