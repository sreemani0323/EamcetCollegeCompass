# --- Stage 1: Build Stage (UNCHANGED) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (FINAL FIX: Jammy Base) ---
# ⭐ FINAL FIX: Use the 'jammy' base image (Ubuntu LTS) for correct PATH setup
FROM eclipse-temurin:25-jre-jammy
WORKDIR /app

# Copy the built JAR using the correct final name
COPY --from=builder /app/target/predictor.jar app.jar

# Use the simple execution command, trusting the Jammy image's PATH
CMD ["java", "-jar", "app.jar"]