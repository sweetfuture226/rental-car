#!/bin/bash
source /home/ubuntu/.bashrc

#Stopping existing node servers
echo "Stopping any existing node servers"
pkill node
ps aux | grep PM2