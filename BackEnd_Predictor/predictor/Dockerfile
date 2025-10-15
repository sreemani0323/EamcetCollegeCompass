# --- Stage 1: Build Stage (UNCHANGED) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (CLEANED) ---
FROM openjdk:25-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/predictor.jar app.jar

# ⭐ CRITICAL FIX: REMOVE ENTRYPOINT. Let the image's default run command (CMD) take over.
# We define the command here as CMD to ensure it is executed correctly.
CMD ["java", "-jar", "app.jar"]