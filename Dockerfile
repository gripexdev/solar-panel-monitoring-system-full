FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Copy source code
COPY src src

# Copy startup script
COPY start.sh .

# Make startup script executable
RUN chmod +x start.sh

# Force clean build for Railway troubleshooting
RUN ./mvnw clean
RUN ./mvnw package -DskipTests

# Expose port
EXPOSE 8080

# Run the application with optimized settings
CMD ["java", "-Xmx512m", "-Xms256m", "-XX:+UseG1GC", "-jar", "target/solar-panel-monitoring-system-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=prod"]