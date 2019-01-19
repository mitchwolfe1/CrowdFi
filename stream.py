import subprocess
import sys

process = subprocess.Popen(["sh", "lol.sh"], stdout=subprocess.PIPE)
for line in iter(process.stdout.readline, ''):
#	sys.stdout.write(line)
	print(line)
