# Solar Panel Monitoring System - Deployment Guide

## Overview
This guide will help you deploy the Solar Panel Monitoring System backend to Railway.

## Prerequisites
- Railway account
- MySQL database (already deployed)
- MQTT broker credentials (optional, system will work without MQTT)

## Environment Variables Setup

### Required Environment Variables
Set these in your Railway project settings:

```
DATABASE_URL=jdbc:mysql://your-mysql-host:3306/your-database-name
DATABASE_USERNAME=your-database-username
DATABASE_PASSWORD=your-database-password
PORT=8080
```

### Optional Environment Variables
```
MQTT_BROKER_URL=ssl://your-mqtt-broker:8883
MQTT_USERNAME=your-mqtt-username
MQTT_PASSWORD=your-mqtt-password
```

## Deployment Steps

### 1. Prepare Your Code
```bash
# Clean and build the project
./mvnw clean package -DskipTests
```

### 2. Deploy to Railway
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the Java project
3. Set the environment variables in Railway dashboard
4. Deploy

### 3. Verify Deployment
After deployment, check these endpoints:
- `https://your-app.railway.app/` - Should return API info
- `https://your-app.railway.app/health` - Should return health status
- `https://your-app.railway.app/actuator/health` - Spring Boot health check

## Troubleshooting

### Common Issues

#### 1. Application Fails to Start
**Symptoms**: Application stops during startup
**Solutions**:
- Check environment variables are set correctly
- Verify database connection
- Check logs for specific error messages

#### 2. Health Check Fails
**Symptoms**: Railway shows deployment failed due to health check
**Solutions**:
- Ensure `/actuator/health` endpoint is accessible
- Check if application is binding to correct port
- Verify database connection

#### 3. MQTT Connection Issues
**Symptoms**: MQTT connection errors in logs
**Solutions**:
- MQTT is now optional - application will start without it
- Check MQTT credentials if you want MQTT functionality
- Application will log warnings but continue running

#### 4. Database Connection Issues
**Symptoms**: Database connection errors
**Solutions**:
- Verify DATABASE_URL format: `jdbc:mysql://host:port/database`
- Check database credentials
- Ensure database is accessible from Railway

### Log Analysis
Check Railway logs for these key messages:
- `"Solar Panel Monitoring System is running"` - Application started successfully
- `"Default admin user created successfully"` - Database connection working
- `"MQTT service initialized successfully"` - MQTT working (optional)
- `"Connected to MQTT broker"` - MQTT connection successful (optional)

### Health Check Endpoints
The application provides multiple health check endpoints:
- `/` - Basic API info
- `/health` - Simple health check
- `/actuator/health` - Spring Boot health check (used by Railway)

## Configuration Files

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "java -jar target/solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod",
    "healthcheckPath": "/actuator/health",
    "healthcheckTimeout": 600,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 5
  }
}
```

### application-prod.properties
Key settings for production:
- Database configuration via environment variables
- MQTT configuration (optional)
- Health check endpoints enabled
- Logging configuration

## Security
- JWT authentication enabled
- CORS configured for frontend access
- Health endpoints are public
- All other endpoints require authentication

## Monitoring
- Application logs available in Railway dashboard
- Health check endpoints for monitoring
- Database connection status in logs
- MQTT connection status in logs (if configured)

## Support
If you encounter issues:
1. Check Railway logs for error messages
2. Verify environment variables are set correctly
3. Test database connection
4. Check if the application is binding to the correct port
5. Verify health check endpoints are accessible

## Recent Fixes Applied
- Made MQTT connection optional (application starts without MQTT)
- Added proper health check endpoints
- Improved error handling in startup process
- Added comprehensive logging
- Fixed security configuration for health endpoints
- Increased health check timeout for Railway 