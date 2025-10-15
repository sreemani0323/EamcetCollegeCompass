# --- Stage 2: Runtime Stage (FINAL DEFINITIVE FIX) ---
# Use the robust JRE image
FROM eclipse-temurin:25-jre-focal
WORKDIR /app

# ⭐ CRITICAL FIX: Set JAVA_HOME and update PATH to ensure 'java' is found.
ENV JAVA_HOME="/opt/java/openjdk"
ENV PATH="$JAVA_HOME/bin:$PATH"

# Copy the built JAR using the correct final name
COPY --from=builder /app/target/predictor.jar app.jar

# Set the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]