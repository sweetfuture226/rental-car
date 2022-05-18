#!/bin/bash
source /home/ubuntu/.bashrc

#create our working directory if it doesnt exist
DIR="/home/ubuntu/source"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi