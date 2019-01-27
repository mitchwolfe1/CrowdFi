const ServerSock = require('./serversock.js');
const MapsSock = require('./mapssocket.js')
var sock = new ServerSock(6969);
var mapssock = new MapsSock(1337);
sock.startWebSocket();
mapssock.startWebSocket();
