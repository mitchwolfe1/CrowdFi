const WebSocketServer = require('ws').Server;
const redis = require('redis'),
	client = redis.createClient();
class MapsSocket {
	constructor(port){
		this.port = port;
		this.connections = [];
	}

	startWebSocket() {
		var cls = this;
		var wss = new WebSocketServer({port: this.port});
		console.log("Started websocket on port " + this.port)
		wss.on("connection", function(ws){
			cls.connections.push(ws);
			ws.on('close', function(){

				for(var i = 0; i < cls.connections.length; i++){
					if(ws === cls.connections[i]){
						cls.connections.splice(i, 1);
					}
				}
				console.log("Connection closed: " + ws._socket.remoteAddress);
			});

			ws.on('message', function(message) {
				ws.send(message);
			});

			console.log("New connection from " + ws._socket.remoteAddress);

		});
	}

	sendMessage(message) {
		this.connections.forEach(function(ws){
			ws.send(message);
		})
	}

}
module.exports = MapsSocket;
