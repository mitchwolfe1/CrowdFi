const WebSocketServer = require('ws').Server;
const Storage = require('./storage.js');
var storage = new Storage()

class ServerSocket {

	constructor(port){
		this.port = port;
		this.connections = [];
	}


	distanceForSignalStrength(signalLevel) {
		let k = -27.55;
		let Ptx = 19.5;
		let CLtx = 0.0;
		let CLrx = 0.0;
		let AGtx = 2.0;
		let AGrx = 0.0;
		let Prx = signalLevel;
		let FM = 14.0;
		let f = 2412.0;
		let fspl = Ptx - CLtx + AGtx + AGrx - CLrx - Prx - FM;
		let distance = Math.pow(10, ((fspl - k - 20.0 * Math.log10(f)) / 20.0) );
		return distance;
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
				var json_obj = JSON.parse(message);
				var distance = cls.distanceForSignalStrength(parseInt(json_obj['signal_strength']));
				json_obj["distance"] = distance;
				storage.storeDeviceData(json_obj["rpi_mac"], json_obj["mac_address"], json_obj["distance"], json_obj["ts"]);
				console.log(json_obj);
			});

			console.log("New connection from " + ws._socket.remoteAddress);

		});
	}
}
module.exports = ServerSocket;