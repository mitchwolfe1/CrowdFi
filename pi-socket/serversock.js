

const WebSocketServer = require('ws').Server;
const Storage = require('./storage.js');
const MapsSocket = require('./mapssocket.js');
var storage = new Storage();

let probe_reqs = 0;
let data = {};

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
		var mapsock = new MapsSocket(1337);
		mapsock.startWebSocket();

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
				storage.storeDeviceData(json_obj["rpi_id"], json_obj["mac_address"], json_obj["distance"], json_obj["ts"]);
				(async () => {
  					try {
    				const rpiPos = await Storage.getRPiPosition(json_obj["rpi_id"]);
  					} catch(e) {}
				})()

				// data[json_obj["mac_address"]] = [Storage.getRPiPositionjson_obj["rpi_id"]]
				mapsocket.sendMessage(); //[lat, lon, weight]
				console.log(json_obj);
			});

			console.log("New connection from " + ws._socket.remoteAddress);

		});
	}

	static latLongAndDistanceToLatLong(ll, d) {
		let rpiLat = ll.lat;
		let rpiLong = ll.long;
		console.log("RPI: " + ll.lat + ", " + ll.long);
		//new_latitude  = latitude  + (dy / r_earth) * (180 / pi);
		//new_longitude = longitude + (dx / r_earth) * (180 / pi) / cos(latitude * pi/180);
		let deviceAngle = Math.floor(Math.random() * 360);
		console.log("Device angle: " + deviceAngle);
		let deltaLong = Math.cos(deviceAngle) * (d / 1000.0);
		let deltaLat = Math.sin(deviceAngle) * (d / 1000.0);
		console.log("dLat: " + deltaLat + ", dLong: " + deltaLong);
		let deviceLat = rpiLat + (deltaLat / 6378) * (180 / Math.pi);
		let deviceLong = rpiLong + (deltaLong / 6378) * (180 / Math.pi) / Math.cos(rpiLat * (Math.pi / 180));
		console.log("DeviceLat: " + deviceLat + ", DeviceLong: " + deviceLong);
		return {lat: deviceLat, long: deviceLong};
	}
}


//testing
let rpiLat = 36.996848;
let rpiLong = -122.051741;

let distance = 6.5;

let rpi = {lat: rpiLat, long: rpiLong};

for (let i = 0; i < 10; i++) {
	let device = ServerSocket.latLongAndDistanceToLatLong(rpi, distance);
	console.log(device.lat + "," + device.long);
}


module.exports = ServerSocket;