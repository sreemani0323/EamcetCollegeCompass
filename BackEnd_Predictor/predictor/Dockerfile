# --- Stage 1: Build Stage (UNCHANGED) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (FINAL PATH FIX) ---
FROM eclipse-temurin:25-jre-focal
WORKDIR /app
COPY --from=builder /app/target/predictor.jar app.jar

# ⭐ FINAL PATH: Using the standard package installation path structure
ENTRYPOINT ["/usr/lib/jvm/java-25-openjdk/bin/java", "-jar", "app.jar"]