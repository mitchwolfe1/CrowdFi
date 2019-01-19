const redis = require('redis'),
	client = redis.createClient();

class Storage {
	constructor() {}

	storeDeviceData(rpiId, devMAC, strength, timestamp) {
		client.hmset(devMAC, rpiId, strength, "timestamp", timestamp);
	}
	storeRPiPosition(rpiId, lat, long) {
		client.hmset(rpiId, "lat", lat, "long", long);
	}
	deviceIsTriangulatable(device) {
		let sum = 0;
		if (client.hmget(device, "1"));
	}
}
