# Solar Panel Monitoring System - Free Deployment Guide

## Overview
This guide will help you deploy your Solar Panel Monitoring System for free using Railway (recommended) or other free platforms.

## Prerequisites
- GitHub account
- Railway account (free at railway.app)
- Basic understanding of Git

## Option 1: Railway Deployment (Recommended)

### Step 1: Prepare Your Repository
1. Fork or clone the repository to your GitHub account
2. Make sure all the deployment files are in place:
   - `Dockerfile` (backend)
   - `front/Dockerfile` (frontend)
   - `railway.json`
   - `src/main/resources/application-prod.properties`

### Step 2: Deploy Backend to Railway
1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect it's a Java project
5. Add environment variables in Railway dashboard:
   ```
   SPRING_PROFILES_ACTIVE=prod
   PORT=8080
   DATABASE_URL=mysql://your-mysql-url
   DATABASE_USERNAME=your-username
   DATABASE_PASSWORD=your-password
   MQTT_BROKER_URL=ssl://z8865828.ala.us-east-1.emqxsl.com:8883
   MQTT_USERNAME=othmane
   MQTT_PASSWORD=othmane
   ```

### Step 3: Add MySQL Database
1. In your Railway project, click "New" → "Database" → "MySQL"
2. Railway will automatically create a MySQL database
3. Copy the database connection details and update your environment variables

### Step 4: Deploy Frontend
1. Create a new service in Railway for the frontend
2. Set the source directory to `front`
3. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

## Option 2: Render Deployment

### Backend Deployment
1. Go to [render.com](https://render.com) and sign up
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod`
   - **Environment**: Java
5. Add environment variables (same as Railway)

### Database Setup
1. Create a new "PostgreSQL" service in Render
2. Update your `application-prod.properties` to use PostgreSQL:
   ```properties
   spring.datasource.driver-class-name=org.postgresql.Driver
   ```

### Frontend Deployment
1. Create a new "Static Site" service
2. Set build command: `npm run build`
3. Set publish directory: `build`

## Option 3: Vercel + PlanetScale

### Backend (Vercel Functions)
1. Create a new Vercel project
2. Convert your Spring Boot app to use Vercel functions
3. This requires more code changes but is completely free

### Database (PlanetScale)
1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new MySQL database
3. Use the connection string in your app

### Frontend (Vercel)
1. Deploy React app to Vercel
2. Vercel provides excellent React hosting

## Environment Variables Reference

### Backend Variables
```bash
SPRING_PROFILES_ACTIVE=prod
PORT=8080
DATABASE_URL=jdbc:mysql://host:port/database
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
MQTT_BROKER_URL=ssl://your-mqtt-broker:8883
MQTT_USERNAME=your-mqtt-username
MQTT_PASSWORD=your-mqtt-password
```

### Frontend Variables
```bash
REACT_APP_API_URL=https://your-backend-url.com
```

## Troubleshooting

### Common Issues
1. **Build Failures**: Check if all dependencies are in `pom.xml`
2. **Database Connection**: Verify database URL format and credentials
3. **CORS Issues**: Update CORS configuration in `CorsConfig.java`
4. **Port Issues**: Make sure `PORT` environment variable is set

### Health Check
Your app includes a health check endpoint at `/actuator/health` for monitoring.

## Cost Breakdown
- **Railway**: Free tier includes 500 hours/month
- **Render**: Free tier includes 750 hours/month  
- **Vercel**: Completely free for personal projects
- **PlanetScale**: Free tier includes 1 database

## Next Steps
1. Set up automatic deployments from GitHub
2. Configure custom domains (if needed)
3. Set up monitoring and alerts
4. Implement CI/CD pipeline

## Support
If you encounter issues:
1. Check the platform's documentation
2. Review the logs in your deployment platform
3. Verify all environment variables are set correctly
4. Test locally with the same configuration 