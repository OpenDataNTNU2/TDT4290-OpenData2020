#!/bin/bash

cd ~/${1:-dev}/backend/
dotnet build
cd ~/${1:-dev}/frontend/
npm ci
npm run build
