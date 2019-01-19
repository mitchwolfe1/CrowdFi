const ServerSock = require('./serversock.js');

var sock = new ServerSock(6969);
sock.startWebSocket();