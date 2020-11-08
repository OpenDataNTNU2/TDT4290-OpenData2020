#!/bin/bash

cd ~/${1:-dev}/
git fetch --prune
git checkout ${1:-dev}
git pull
