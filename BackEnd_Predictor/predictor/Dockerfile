# Multi-stage Dockerfile for the College Predictor application
# This Dockerfile creates an optimized container image with security best practices

# --- Stage 1: Build Stage ---
# Use Maven 3.9 with Eclipse Temurin 21 JDK as the base image for building
FROM maven:3.9-eclipse-temurin-21 AS builder
# Set working directory inside the container
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer for faster rebuilds)
COPY pom.xml .
# Download all Maven dependencies without compiling the code
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src /app/src
# Clean and package the application, skipping tests for faster builds
RUN mvn clean package -DskipTests -B

# --- Stage 2: Runtime Stage ---
# Use Eclipse Temurin 21 JRE Alpine image for a smaller runtime footprint
FROM eclipse-temurin:21-jre-alpine
# Set working directory inside the container
WORKDIR /app

# Add non-root user for security (principle of least privilege)
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Change ownership of files to the spring user for security
RUN chown -R spring:spring /app

# Switch to non-root user for running the application
USER spring:spring

# Expose port 8080 for the application
EXPOSE 8080

# Health check to verify the application is running
# Sends an HTTP request to the /ping endpoint every 30 seconds
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ping || exit 1

# Run the application with optimized JVM settings for containers
ENTRYPOINT ["java", \
  # Enable container support for proper memory management
  "-XX:+UseContainerSupport", \
  # Set maximum heap size to 75% of container memory
  "-XX:MaxRAMPercentage=75.0", \
  # Exit on OutOfMemoryError for container restart policies
  "-XX:+ExitOnOutOfMemoryError", \
  # Use /dev/./urandom for faster random number generation
  "-Djava.security.egd=file:/dev/./urandom", \
  # Run the application JAR file
  "-jar", "app.jar"]