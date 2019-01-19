import subprocess
import sys
import netifaces

scan_iface = sys.argv[1]
mac_iface = sys.argv[2]

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
	except Exception as e:
		ts = ""
		signal_strength = ""
		mac_addy = ""
		ssid = ""
		rpi_mac = ""

		print(str(e))

	print(ts + " " + str(signal_strength) + " " + mac_addy + " " + ssid + " " + rpi_mac)
