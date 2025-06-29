#!/bin/bash

echo "Starting Solar Panel Monitoring System..."

# Set Java options for better performance and memory management
export JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC"

# Start the application
echo "Starting application with profile: prod"
java $JAVA_OPTS -jar target/solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

echo "Application startup completed." 