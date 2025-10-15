# --- Stage 1: Build Stage (UNCHANGED) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (Final PATH Fix) ---
FROM eclipse-temurin:25-jdk
WORKDIR /app

COPY --from=builder /app/target/predictor.jar app.jar

# ⭐ DEFINITIVE FIX: Use the specific internal path relative to JAVA_HOME
# This path is almost guaranteed to be correct for this base image.
ENTRYPOINT ["/opt/java/openjdk/bin/java", "-jar", "app.jar"]