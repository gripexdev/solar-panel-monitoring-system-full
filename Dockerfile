FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Copy source code
COPY src src

# Force clean build for Railway troubleshooting
RUN ./mvnw clean
RUN ./mvnw package -DskipTests

# Debug: List contents of target directory
RUN ls -l target

# Copy the built JAR as app.jar
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application with optimized settings
CMD ["java", "-Xmx512m", "-Xms256m", "-XX:+UseG1GC", "-jar", "app.jar", "--spring.profiles.active=prod"]