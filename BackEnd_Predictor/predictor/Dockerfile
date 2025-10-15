# --- Stage 1: Build Stage (UNCHANGED) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage ---
FROM openjdk:25-jdk
WORKDIR /app

# ⭐ DEFINITIVE FIX: Use the wildcard to capture the file regardless of version/classifier.
COPY --from=builder /app/target/*.jar app.jar

# Entrypoint should still be 'java -jar app.jar' (which is now correct)
CMD ["java", "-jar", "app.jar"]