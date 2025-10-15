# --- Stage 1: Build Stage (Compiles the application) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app

COPY pom.xml .
COPY src /app/src

RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (Use the full, robust JDK image) ---
# We use the full 'jdk' image to guarantee the 'java' executable is found in PATH.
FROM eclipse-temurin:25-jdk
WORKDIR /app

# Copy the built JAR using the correct final name
COPY --from=builder /app/target/predictor.jar app.jar

# Set the command to run the application (Render will now find 'java' correctly)
CMD ["java", "-jar", "app.jar"]