@echo off
echo 🚀 Solar Panel Monitoring System - Deployment Helper
echo ==================================================

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if the repository is a git repository
if not exist ".git" (
    echo ❌ This is not a git repository. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    pause
    exit /b 1
)

echo ✅ Git repository found

REM Check if all required files exist
echo 📋 Checking required deployment files...

set missing_files=

if not exist "Dockerfile" set missing_files=!missing_files! Dockerfile
if not exist "front\Dockerfile" set missing_files=!missing_files! front\Dockerfile
if not exist "railway.json" set missing_files=!missing_files! railway.json
if not exist "src\main\resources\application-prod.properties" set missing_files=!missing_files! src\main\resources\application-prod.properties
if not exist "front\nginx.conf" set missing_files=!missing_files! front\nginx.conf

if "%missing_files%"=="" (
    echo ✅ All required deployment files are present
) else (
    echo ❌ Missing required files:
    for %%f in (%missing_files%) do echo    - %%f
    pause
    exit /b 1
)

echo.
echo 🎯 Deployment Options:
echo 1. Railway (Recommended - Easiest)
echo 2. Render
echo 3. Vercel + PlanetScale
echo.

set /p choice="Choose your deployment option (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🚂 Railway Deployment Instructions:
    echo 1. Go to https://railway.app and sign up
    echo 2. Click "New Project" → "Deploy from GitHub repo"
    echo 3. Select this repository
    echo 4. Add a MySQL database service
    echo 5. Configure environment variables (see DEPLOYMENT_GUIDE.md)
    echo 6. Deploy frontend as a separate service
) else if "%choice%"=="2" (
    echo.
    echo 🎨 Render Deployment Instructions:
    echo 1. Go to https://render.com and sign up
    echo 2. Create a new "Web Service" for backend
    echo 3. Create a new "PostgreSQL" service for database
    echo 4. Create a new "Static Site" for frontend
    echo 5. Configure environment variables (see DEPLOYMENT_GUIDE.md)
) else if "%choice%"=="3" (
    echo.
    echo ⚡ Vercel + PlanetScale Deployment Instructions:
    echo 1. Go to https://vercel.com and sign up
    echo 2. Go to https://planetscale.com and create a MySQL database
    echo 3. Deploy frontend to Vercel
    echo 4. Convert backend to Vercel functions (requires code changes)
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 📚 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo 🔧 Make sure to update environment variables with your actual values
echo 🌐 Your app will be available at the URL provided by your chosen platform

echo Starting deployment process...

REM Clean and build the project
echo Cleaning and building the project...
call mvnw.cmd clean package -DskipTests

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    echo JAR file created at: target/solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar
    
    REM Check if JAR file exists
    if exist "target\solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar" (
        echo JAR file verification successful!
        echo Ready for deployment!
    ) else (
        echo ERROR: JAR file not found!
        exit /b 1
    )
) else (
    echo ERROR: Build failed!
    exit /b 1
)

echo Deployment preparation completed!
pause 