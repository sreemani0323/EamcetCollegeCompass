# --- Stage 1: Build Stage (Compiles the application) ---
# Use a Maven image with JDK 25 to handle compilation
FROM maven:3.9.6-eclipse-temurin-25 AS builder
WORKDIR /app

# Copy the pom.xml and the source code (src/)
COPY pom.xml .
COPY src /app/src

# Compile the project and generate the executable JAR
# The name of the JAR file will be predictor-0.0.1-SNAPSHOT.jar (based on standard Maven naming)
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (Runs the final application) ---
# Use a lighter JRE 25 image to keep the final container small
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy the built JAR from the builder stage into the runtime image
# We use the wildcard * to avoid hardcoding the version number
COPY --from=builder /app/target/*.jar app.jar

# Set the command to run the application when the container starts
# The application runs inside the container on port 8080 (as configured in application.properties)
ENTRYPOINT ["java", "-jar", "/app.jar"]