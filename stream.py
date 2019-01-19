import subprocess
import sys
import netifaces
from websocket import create_connection
import json

scan_iface = sys.argv[1]
mac_iface = sys.argv[2]

ws = create_connection("ws://localhost:6969")


process = subprocess.Popen(["sh", "lol.sh", scan_iface], stdout=subprocess.PIPE)
for line in iter(process.stdout.readline, b''):
	try:
		line = str(line).replace("b'", "").replace("\\n'", "")
		line_arr = line.split(" ")
		ts = line_arr[0]
		signal_strength = int(line_arr[1].replace("dBm", ""))
		mac_addy = line_arr[2]
		ssid = line_arr[3].replace("\"", "")
		rpi_mac = netifaces.ifaddresses(mac_iface)[netifaces.AF_LINK][0]["addr"]
		
		json_obj = {"ts":ts, "signal_strength":str(signal_strength), "mac_address":mac_addy, "rpi_mac": rpi_mac, "ssid":ssid}
		json_obj = json.dumps(json_obj)
		ws.send(json_obj)
		print(ts + " " + str(signal_strength) + " " + mac_addy + " " + ssid + " " + rpi_mac)


	except Exception as e:

		print(str(e))

