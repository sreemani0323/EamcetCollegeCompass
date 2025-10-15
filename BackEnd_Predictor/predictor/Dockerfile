# --- Stage 1: Build Stage (Switching to a generic JIT build tag for safety) ---
FROM eclipse-temurin:25-jdk-focal AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (Use a robust Debian-based JRE for stable PATH) ---
FROM eclipse-temurin:25-jre-focal
WORKDIR /app

COPY --from=builder /app/target/predictor.jar app.jar

# Use the standard exec form. The robust JRE image will now find 'java'.
ENTRYPOINT ["java", "-jar", "app.jar"]