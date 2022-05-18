#!/bin/bash
source /home/ubuntu/.bashrc

#give permission for everything in the source directory
sudo chmod -R 777 /home/ubuntu/source

#navigate into our working directory where we have all our github files
cd /home/ubuntu/source

#Stopping existing node servers
echo "Stopping any existing pm2 processes"
pm2 stop all
pm2 delete all
# pm2 start npm --name "source" -- start
pm2 start npm -- start
# pm2 start process.env.RUN --name source