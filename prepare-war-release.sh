#!/bin/bash

# Configuration
VERSION="1.0.0"
APP_NAME="component-analysis-dashboard"

# Ensure we're in the project root
if [ ! -f "pom.xml" ]; then
    echo "Error: pom.xml not found. Please run this script from the project root."
    exit 1
fi

# Build the project
echo "Building project..."
mvn clean package -DskipTests

# Create release directory
RELEASE_DIR="release"
mkdir -p $RELEASE_DIR

# Copy and rename WAR
echo "Preparing release files..."
cp target/*.war "$RELEASE_DIR/$APP_NAME-$VERSION.war"

# Generate checksum
cd $RELEASE_DIR
sha256sum "$APP_NAME-$VERSION.war" > SHA256SUMS

# Create version info file
echo "Version: $VERSION" > VERSION.txt
echo "Build date: $(date)" >> VERSION.txt

# Create a zip containing all files
zip "$APP_NAME-$VERSION-release.zip" "$APP_NAME-$VERSION.war" SHA256SUMS VERSION.txt
cd ..

echo "Release files prepared in $RELEASE_DIR directory:"
ls -l $RELEASE_DIR

echo "Ready for upload to GitHub release:"
echo "- $RELEASE_DIR/$APP_NAME-$VERSION-release.zip"