#!/bin/bash

cd ~/${1:-dev}/backend/
dotnet ./bin/Debug/netcoreapp3.1/netcoreapp3.1/OpenData.API.dll > ~/${1:-dev}/backend/output.log 2>&1  &
cd ~/${1:-dev}/frontend/
npm run start > ~/${1:-dev}/frontend/output.log 2>&1 &

