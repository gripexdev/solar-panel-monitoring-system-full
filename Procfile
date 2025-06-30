FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR from your local machine
COPY target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-Xmx512m", "-Xms256m", "-XX:+UseG1GC", "-jar", "app.jar", "--spring.profiles.active=prod"] 