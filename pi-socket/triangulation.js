const redis = require('redis'),
	client = redis.createClient();

class Triangulation {
	constructor() {}

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

	triangulateDevice(device) {
		// Gather the necessary data from redis
		var signal_strengths = [];
		var rpiInfo = [];
		var getSignalStrengthPromise = new Promise(function(resolve, reject) {
			client.hmget(device, "1", "2", "3", "4", "5", function (err, res) {
				if (err != null) {
					reject(err);
				} else {
					resolve(res);
				}
			});
		}).then(function(result) {}
		);
	}

}


let t = new Triangulation();
for (let i = -5; i > -90; i--){
	console.log("power: " + i + " : " + t.distanceForSignalStrength(i));
}
t.triangulateDevice("TE:ST:MA:C_");
//console.log(t.distanceForSignalStrength(-17));
