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
			console.log(MapsSocket.getMacData());
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

	static getMacData() {
		let macPromise =  new Promise(function(resolve, reject) {
			client.keys("*", function (err, res) {
				resolve(res);
			});
		}).then(function(macs) {
			let mac_data = {};
			let mac_promises = [];
			macs.forEach(function(mac) {
				mac_promises.push(new Promise(function(resolve, reject) {
					client.hgetall(mac, function(err, res) {
						resolve(res);
					});
				}));
			});
			return Promise.all(mac_promises);
		});
	}



}
module.exports = MapsSocket;
