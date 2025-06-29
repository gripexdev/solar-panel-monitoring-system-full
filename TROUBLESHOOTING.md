# Troubleshooting Guide - Railway Deployment

## Current Issue
The application starts successfully but appears to stop after MQTT service initialization.

## Analysis of Current Logs
From the logs, we can see:
✅ Database connection successful
✅ MQTT connection successful  
✅ Application initialization progressing
❌ Application stops after MQTT service initialization

## Potential Causes and Solutions

### 1. Application Startup Process
**Issue**: The application might be failing during the final startup phase
**Solution**: Added comprehensive logging to track startup process

### 2. Health Check Configuration
**Issue**: Railway health check might be failing
**Solution**: 
- Changed health check path from `/actuator/health` to `/health`
- Reduced health check timeout to 300 seconds
- Added multiple health check endpoints

### 3. Memory/Resource Issues
**Issue**: Application might be running out of memory
**Solution**: Added Java memory options in startup script

### 4. Port Binding Issues
**Issue**: Application might not be binding to the correct port
**Solution**: Ensured PORT environment variable is properly configured

## Debugging Steps

### Step 1: Check Application Logs
Look for these key log messages:
- `"🚀 Application started event triggered"`
- `"✅ Application ready event triggered"`
- `"Default admin user created successfully"`
- `"CommandLineRunner completed"`

### Step 2: Test Health Endpoints
After deployment, test these endpoints:
- `https://your-app.railway.app/health`
- `https://your-app.railway.app/`
- `https://your-app.railway.app/test`
- `https://your-app.railway.app/actuator/health`

### Step 3: Check Railway Dashboard
- Verify the service shows as "Deployed"
- Check if there are any error messages
- Monitor resource usage

## Environment Variables Checklist
Ensure these are set in Railway:
```
DATABASE_URL=jdbc:mysql://your-mysql-host:3306/your-database-name
DATABASE_USERNAME=your-database-username
DATABASE_PASSWORD=your-database-password
PORT=8080
```

## Recent Changes Made
1. **Enhanced Logging**: Added comprehensive startup logging
2. **Startup Listener**: Added application lifecycle tracking
3. **Health Endpoints**: Added multiple health check endpoints
4. **Startup Script**: Created custom startup script with memory optimization
5. **Railway Config**: Updated health check settings

## Next Steps
1. Deploy the updated code
2. Monitor the logs for the new startup messages
3. Test the health endpoints
4. If still failing, check Railway logs for any error messages

## Expected Success Indicators
- Application logs show "Application ready event triggered"
- Health endpoints return 200 OK responses
- Railway dashboard shows service as "Deployed"
- No error messages in logs after startup

## Fallback Options
If the issue persists:
1. Try deploying without MQTT (remove MQTT environment variables)
2. Check if database connection is stable
3. Verify all environment variables are correctly set
4. Consider using a different port or configuration 