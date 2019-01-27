# CrowdFi

**1st place winner at CruzHacks 2019.** CrowdFi is a real-time crowd density mapping platform built in 36 hours that estimates and visualizes where people are gathered using passive WiFi sensing, with no app install or participation required.

## How It Works

Every smartphone constantly emits 802.11 WiFi probe requests while searching for known networks. CrowdFi turns that ambient signal into a live crowd heatmap:

1. **Capture:** Raspberry Pis with a WiFi adapter in monitor mode passively listen for probe requests with `tcpdump`, parsing each one down to a timestamp, signal strength (dBm), sender MAC, and requested SSID.
2. **Stream:** each Pi forwards every probe as JSON over a WebSocket to a central Node.js server.
3. **Estimate:** the server converts each probe's signal strength into an estimated distance using a free-space path loss (FSPL) model, and combines it with the Pi's registered GPS position to estimate the device's location.
4. **Visualize:** estimated locations are fanned out to a live Google Maps heatmap dashboard showing crowd density in real time.

## Notes

- Trilateration support in `pi-socket/trilateration.js` is based on [gheja/trilateration.js](https://github.com/gheja/trilateration.js), used to pin down a device from multiple Pi sightings.
- As is traditional for hackathon code, expect rough edges.
