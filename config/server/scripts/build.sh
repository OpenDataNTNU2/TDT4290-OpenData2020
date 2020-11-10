#!/bin/bash

cd ~/${1:-dev}/backend/
dotnet build
cd ~/${1:-dev}/frontend/
npm install
npm run build
