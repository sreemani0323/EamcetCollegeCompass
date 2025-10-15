# --- Stage 1: Build Stage (Compiles the application) ---
# Use a Maven image with a known-to-exist JDK 25 tag for compilation
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app

# Copy the pom.xml and the source code (src/)
COPY pom.xml .
COPY src /app/src

# Compile the project and generate the executable JAR
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (Runs the final application) ---
# Use a lighter JRE 25 image to keep the final container small
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# ⭐ CRITICAL FIX: Copy the JAR using the specific name 'predictor.jar'
COPY --from=builder /app/target/predictor.jar app.jar

# Set the command to run the application when the container starts
# The application runs inside the container on port 8080 (as configured in application.properties)
ENTRYPOINT ["java", "-jar", "app.jar"]