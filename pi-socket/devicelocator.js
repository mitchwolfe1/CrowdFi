const redis = require('redis'),
	client = redis.createClient();

const trilaterate = require("./trilateration");


class DeviceLocator {
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
		var getDistancesPromise = new Promise(function(resolve, reject) {
			client.hmget(device, "RPI1", "RPI2", "RPI3", "RPI4", "RPI5", function (err, res) {
				if (err != null) {
					reject(err);
				} else {
					resolve(res);
				}
			});
		});
		getDistancesPromise.then(function(result) {
			let rpiPromises = [];
			let rpiIds = ["RPI1", "RPI2", "RPI3", "RPI4", "RPI5"];
			for (let i in rpiIds) {
				let rpiId = rpiIds[i];
				//console.log("ID: " + rpiId);
				let rpiPromise = new Promise(function (resolve, reject) {
					client.hmget(rpiId, "x", "y", function (err, res) {
						if (err != null) {
							reject(err);
						} else {
							resolve(res);
						}
					});

				});
				rpiPromises.push(rpiPromise);
			}

			Promise.all(rpiPromises).then(function(values) {
				let distances = result;
				let p1 = {x: parseFloat(values[1][0]), y: parseFloat(values[1][1]), r: parseFloat(distances[1])};
				let p2 = {x: parseFloat(values[2][0]), y: parseFloat(values[2][1]), r: parseFloat(distances[2])};
				let p3 = {x: parseFloat(values[4][0]), y: parseFloat(values[4][1]), r: parseFloat(distances[4])};
				console.log(p1);
				console.log(p2);
				console.log(p3);
			});
		});
		getDistancesPromise.catch(function(error) {
			console.log(error);
		});
	}
}


let d = new DeviceLocator();
for (let i = -5; i > -90; i--){
	console.log("power: " + i + " : " + d.distanceForSignalStrength(i));
}



//t.triangulateDevice("TE:ST:MA:C_");
//console.log(t.distanceForSignalStrength(-17));


const stdin = process.openStdin();
stdin.addListener('data', text => {
	const mac = text.toString().trim();
	d.triangulateDevice(mac);
});
