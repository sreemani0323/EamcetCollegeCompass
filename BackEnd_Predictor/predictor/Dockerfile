# --- Stage 1: Build Stage (UNCHANGED) ---
FROM maven:4.0.0-rc-4-eclipse-temurin-25-noble AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn clean package -DskipTests

# --- Stage 2: Runtime Stage (FINAL PATH/IMAGE FIX) ---
# ⭐ FINAL FIX: Using the generic, full OpenJDK image for maximum path compatibility.
FROM openjdk:25-jdk
WORKDIR /app

# Define JAVA_HOME for the shell to find the executable (required for some older shells)
ENV JAVA_HOME="/usr/local/openjdk-25"
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Copy the built JAR using the correct final name
COPY --from=builder /app/target/predictor.jar app.jar

# Use the standard command, which should now work due to the ENV setup
ENTRYPOINT ["java", "-jar", "app.jar"]