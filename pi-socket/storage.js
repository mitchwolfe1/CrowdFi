

const redis = require('redis'),
	client = redis.createClient();

class Storage {
	constructor() {}

	storeDeviceData(rpiId, devMAC, distance, timestamp) {
		client.hmset(devMAC, rpiId, distance, "timestamp", timestamp);
	}
	storeRPiPosition(rpiId, lat, long) {
		client.hmset(rpiId, "lat", lat, "long", long);
	}
	deviceIsTriangulatable(device) {
		let promise = new Promise(function(resolve, reject) {
			let sum = 0;
			client.hmget(device, "1", "2", "3", "4", "5", function(err, res) {
				for (let i = 0; i < res.length; i++) {
					if (res[i] != '') sum++;
				}
			});
			resolve(sum > 2);
		});

		promise.then(function(value) {
			console.log("Success: " + value);
			return 1;
		});
	}
}
module.exports = Storage;
//var storage = new Storage();
//console.log(storage.deviceIsTriangulatable("TE:ST:MA:C_"));
