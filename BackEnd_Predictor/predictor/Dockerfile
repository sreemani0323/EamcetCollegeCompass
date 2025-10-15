# --- Stage 1: Build Stage (UNCHANGED) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (ROBUST FIX) ---
# Use the official JDK image—it has the best tools and path configuration
FROM eclipse-temurin:25-jdk
WORKDIR /app

COPY --from=builder /app/target/predictor.jar app.jar

# ⭐ CRITICAL FIX: Use the 'shell' form of ENTRYPOINT to ensure the command runs via bash.
# This often loads the environment properly where the exec form fails.
ENTRYPOINT ["/bin/bash", "-c", "java -jar app.jar"]