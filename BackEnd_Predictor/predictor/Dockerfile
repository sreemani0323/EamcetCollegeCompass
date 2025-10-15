# --- Stage 1: Build Stage (Compiles the application) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app

# Copy the pom.xml and the source code (src/)
COPY pom.xml .
COPY src /app/src

# Compile the project and generate the executable JAR
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (Runs the final application) ---
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy the built JAR using the correct final name
COPY --from=builder /app/target/predictor.jar app.jar

# ⭐ FINAL FIX: Use the absolute path to the Java executable to avoid 'command not found' (status 127) error.
ENTRYPOINT ["/usr/bin/java", "-jar", "app.jar"]