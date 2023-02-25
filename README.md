
# DANTE-PROXY MONITOR
monitor dante-server proxy usage from journalctl

this is a simple node.js script to grab dante socks proxy usage from journalctl and store in redis database , so you can monitor how mus data transfered by the users and who use dante proxy.
this script do not store detaild usage , just keep the username and how much data the user fetch.

# How To Use : 
I test this script on ubuntu 22.04 LTS
 - install and start dante proxy first , do not need to force dante to log usage in log file , the default log strategy to send usage to syslog/journalctl is enugh.
 - install redis , something like **apt install redis**  and start redis with **systemctl start redis** commands.
 - clone git repo git clone https://<REPO_ADDRESS>
 - go in script directory 
 - run **npm install**
 - start script with **node** or **nodemon** or **forever** or **pm2** 

the traffic counters are in **http://<_HOSTNAME_>:80**
