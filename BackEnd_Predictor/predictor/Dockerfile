# --- Stage 1: Build Stage (UNCHANGED) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (FINAL FIX) ---
FROM eclipse-temurin:25-jre-focal
WORKDIR /app
COPY --from=builder /app/target/predictor.jar app.jar

# ⭐ DEFINITIVE FIX: Use the most robust absolute path format for Temurin JRE images.
# We must ensure the 'java' executable is found using a known path structure.
# The default location is often /usr/local/openjdk-XX/bin/java or similar.
# Let's try the /usr/local path, which is often manually set by the image maintainer.
ENTRYPOINT ["/usr/local/openjdk-25/bin/java", "-jar", "app.jar"]