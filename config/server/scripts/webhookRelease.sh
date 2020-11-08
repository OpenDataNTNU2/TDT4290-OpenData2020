#!/bin/bash

cd ~/shortcuts/scripts
./stop.sh
./update.sh release
./build.sh release
./run.sh release
