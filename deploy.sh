#!/bin/bash

echo "🚀 Solar Panel Monitoring System - Deployment Helper"
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if the repository is a git repository
if [ ! -d ".git" ]; then
    echo "❌ This is not a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Git repository found"

# Check if all required files exist
echo "📋 Checking required deployment files..."

required_files=(
    "Dockerfile"
    "front/Dockerfile"
    "railway.json"
    "src/main/resources/application-prod.properties"
    "front/nginx.conf"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required deployment files are present"
else
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo ""
echo "🎯 Deployment Options:"
echo "1. Railway (Recommended - Easiest)"
echo "2. Render"
echo "3. Vercel + PlanetScale"
echo ""

read -p "Choose your deployment option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚂 Railway Deployment Instructions:"
        echo "1. Go to https://railway.app and sign up"
        echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "3. Select this repository"
        echo "4. Add a MySQL database service"
        echo "5. Configure environment variables (see DEPLOYMENT_GUIDE.md)"
        echo "6. Deploy frontend as a separate service"
        ;;
    2)
        echo ""
        echo "🎨 Render Deployment Instructions:"
        echo "1. Go to https://render.com and sign up"
        echo "2. Create a new 'Web Service' for backend"
        echo "3. Create a new 'PostgreSQL' service for database"
        echo "4. Create a new 'Static Site' for frontend"
        echo "5. Configure environment variables (see DEPLOYMENT_GUIDE.md)"
        ;;
    3)
        echo ""
        echo "⚡ Vercel + PlanetScale Deployment Instructions:"
        echo "1. Go to https://vercel.com and sign up"
        echo "2. Go to https://planetscale.com and create a MySQL database"
        echo "3. Deploy frontend to Vercel"
        echo "4. Convert backend to Vercel functions (requires code changes)"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo "🔧 Make sure to update environment variables with your actual values"
echo "🌐 Your app will be available at the URL provided by your chosen platform"

echo "Starting deployment process..."

# Clean and build the project
echo "Cleaning and building the project..."
./mvnw clean package -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "JAR file created at: target/solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar"
    
    # Check if JAR file exists
    if [ -f "target/solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar" ]; then
        echo "JAR file verification successful!"
        echo "Ready for deployment!"
    else
        echo "ERROR: JAR file not found!"
        exit 1
    fi
else
    echo "ERROR: Build failed!"
    exit 1
fi

echo "Deployment preparation completed!" 