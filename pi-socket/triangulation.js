const redis = require('redis'),
	client = redis.createClient();

class Point {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static distance(p1, p2) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));

	}

	static add(p1, p2) {
		return new Point(p1.x + p2.x, p1.y + p2.y, p1.z + p2.z);
	}

	static sub(p1, p2) {
		return new Point(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
	}

	static mult(p1, mul) {
		return new Point(p1.x * mul, p1.y * mul, p1.z * mul);
	}



	distance(aPoint) {
		return Point.distance(this, aPoint);
	}

	add(aPoint) {
		return Point.add(this, aPoint);
	}

	sub(aPoint) {
		return Point.sub(this, aPoint);
	}

	mult(mul) {
		return Point.mult(this, mul);
	}
}

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
		var getDistancesPromise = new Promise(function(resolve, reject) {
			client.hmget(device, "1", "2", "3", "4", "5", function (err, res) {
				if (err != null) {
					reject(err);
				} else {
					resolve(res);
				}
			});
		});
		getDistancesPromise.then(function(result) {
			let rpiPromises = [];
			let rpiIds = ["PI1", "PI2", "PI3", "PI4", "PI5"];
			for (let i in rpiIds) {
				let rpiId = rpiIds[i];
				console.log("ID: " + rpiId);
				let rpiPromise = new Promise(function (resolve, reject) {
					client.hmget(rpiId, "lat", "long", function (err, res) {
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
				let ITER = 2000;
				let ALPHA = 2.0;
				let RATIO = 0.99;
				let piData = {"PI1" : values[0], "PI2" : values[1], "PI3" : values[2], "PI4" : values[3], "PI5" :  values[4]};
				let distances = result;
				console.log(piData);
				console.log(distances);
			});
		});
		getDistancesPromise.catch(function(error) {
			console.log(error);
		});
	}
}


let t = new Triangulation();
for (let i = -5; i > -90; i--){
	console.log("power: " + i + " : " + t.distanceForSignalStrength(i));
}
t.triangulateDevice("TE:ST:MA:C_");
//console.log(t.distanceForSignalStrength(-17));
