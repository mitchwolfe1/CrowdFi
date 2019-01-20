

const redis = require('redis'),
	client = redis.createClient();

class Storage {
	constructor() {}

	storeDeviceData(rpiId, devMAC, distance, timestamp) {
		client.hmset(devMAC, rpiId, distance, "timestamp", timestamp);
		//console.log("PROBE MAC: " + devMAC + ", RPI: " + rpiId + ", DISTANCE: " + distance + ", TIMESTAMP: " + timestamp);
}
	storeRPiPosition(rpiId, lat, long) {
		client.hmset(rpiId, "lat", lat, "long", long);
	}

	static getRPiPosition(rpiId) {
		let p = new Promise((resolve, reject) => {
			client.hgetall(rpiId, (error, response) => {
				if (error != null) {
					reject(error);
				} else {
					resolve({lat: response[1], long: response[3]});
				}
			});
		});
		return p;
	}
}
module.exports = Storage;
//var storage = new Storage();
//console.log(storage.deviceIsTriangulatable("TE:ST:MA:C_"));
