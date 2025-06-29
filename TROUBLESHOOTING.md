# Troubleshooting Guide - Railway Deployment

## Current Issue
The application fails to start because the `start.sh` script is not found in the container.

## Analysis of Current Logs
From the logs, we can see:
❌ `chmod: cannot access 'start.sh': No such file or directory`
❌ Container stops immediately

## Root Cause
Railway is not including the `start.sh` file in the deployment container, causing the startup command to fail.

## Solutions Applied

### 1. Updated Railway Configuration
Changed `railway.json` to use direct Java command instead of startup script:
```json
{
  "deploy": {
    "startCommand": "java -Xmx512m -Xms256m -XX:+UseG1GC -jar target/solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod"
  }
}
```

### 2. Updated Dockerfile
- Added startup script copying
- Made script executable
- Updated CMD to use optimized Java settings

### 3. Added Alternative Deployment Methods
- Created `Procfile` for Railway deployment
- Added `.dockerignore` to ensure proper file inclusion

## Debugging Steps

### Step 1: Verify File Structure
Ensure these files are in your repository:
- `railway.json`
- `Procfile`
- `start.sh`
- `Dockerfile`

### Step 2: Check Railway Build
Monitor the build logs for:
- Successful Maven build
- JAR file creation
- No file access errors

### Step 3: Monitor Startup Logs
Look for these success indicators:
- `"Starting Solar Panel Monitoring System Application..."`
- `"🚀 Application started event triggered"`
- `"✅ Application ready event triggered"`
- `"Default admin user created successfully"`

## Environment Variables Checklist
Ensure these are set in Railway:
```
DATABASE_URL=jdbc:mysql://your-mysql-host:3306/your-database-name
DATABASE_USERNAME=your-database-username
DATABASE_PASSWORD=your-database-password
PORT=8080
```

## Recent Changes Made
1. **Fixed Startup Command**: Removed dependency on startup script
2. **Direct Java Command**: Using optimized Java settings directly in railway.json
3. **Alternative Methods**: Added Procfile for Railway deployment
4. **Docker Configuration**: Updated Dockerfile to include startup script
5. **File Management**: Added .dockerignore for proper file inclusion

## Next Steps
1. Deploy the updated code with the new railway.json configuration
2. Monitor the build and startup logs
3. Test health endpoints after successful deployment
4. Verify application functionality

## Expected Success Indicators
- No "start.sh not found" errors
- Application starts with Java command
- Health endpoints return 200 OK responses
- Railway dashboard shows service as "Deployed"

## Fallback Options
If the issue persists:
1. Try using the Procfile method instead of railway.json
2. Check if all environment variables are correctly set
3. Verify database connection is stable
4. Consider using a different deployment platform

## Health Check Endpoints
After successful deployment, test:
- `https://your-app.railway.app/health`
- `https://your-app.railway.app/`
- `https://your-app.railway.app/test`
- `https://your-app.railway.app/actuator/health` 