tcpdump -l -I -i "wlan1" -e -s 256 type mgt subtype probe-req | awk -f parse-tcpdump.awk | tee -a "out.txt"
