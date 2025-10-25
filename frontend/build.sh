#!/bin/bash

# Build script for frontend deployment
echo "Building Synapse Mapper Frontend..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!"
echo "Static files are in the 'dist' directory"
