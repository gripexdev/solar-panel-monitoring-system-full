#!/bin/bash

echo "Starting Solar Panel Monitoring System..."

# Set Java options for better performance and memory management
export JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC"

# Start the application in background
echo "Starting application with profile: prod"
java $JAVA_OPTS -jar target/solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod &

# Wait a bit for the application to start
sleep 30

# Check if the application is running
echo "Checking if application is running..."
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "Health check passed"
else
    echo "❌ Application health check failed"
    echo "Checking application logs..."
    ps aux | grep java
fi

# Keep the script running
wait 