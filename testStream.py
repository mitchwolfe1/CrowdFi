import sys
import json
import socket
import time
import subprocess
import os
import glob
import argparse
import logging
import statistics
import atexit


def process_scan(time_window):
    logger.debug("Reading files...")
    output = ""
    maxFileNumber = -1
    fileNameToRead = ""
    for filename in glob.glob("/tmp/tshark-temp*"):
        fileNumber = int(filename.split("_")[1])
        if fileNumber > maxFileNumber:
            maxFileNumber = fileNumber
            fileNameToRead = filename

    logger.debug("Reading from %s" % fileNameToRead)
    cmd = subprocess.Popen(("tshark -r "+fileNameToRead+" -T fields -e frame.time_epoch -e wlan.sa -e wlan.bssid -e radiotap.dbm_antsignal").split(
    ), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output += cmd.stdout.read().decode('utf-8')

    timestamp_threshold = float(time.time()) - float(time_window)
    fingerprints = {}
    relevant_lines = 0
    for line in output.splitlines():
        try:
            timestamp, mac, mac2, power_levels = line.split("\t")

            if mac == mac2 or float(timestamp) < timestamp_threshold or len(mac) == 0:
                continue
            
            relevant_lines+=1
            rssi = power_levels.split(',')[0]
            if len(rssi) == 0:
                continue

            if mac not in fingerprints:
                fingerprints[mac] = []
            fingerprints[mac].append(float(rssi))
        except:
            pass
    logger.debug("..done")

    # Compute medians
    fingerprints2 = []
    for mac in fingerprints:
        if len(fingerprints[mac]) == 0:
            continue
        print(mac)
        print(fingerprints[mac])
        fingerprints2.append(
            {"mac": mac, "rssi": int(statistics.median(fingerprints[mac]))})

    logger.debug("Processed %d lines, found %d fingerprints in %d relevant lines" %
                 (len(output.splitlines()), len(fingerprints2),relevant_lines))

    payload = {
        "node": socket.gethostname(),
        "signals": fingerprints2,
        "timestamp": int(
            time.time())}
    logger.debug(payload)
    return payload