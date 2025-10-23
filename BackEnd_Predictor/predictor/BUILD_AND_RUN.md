# Quick Build & Run Guide

## 🏃 Quick Start (Windows)

### Option 1: Maven Wrapper (Recommended)
```powershell
# Navigate to project
cd c:\Users\nalli\CollegePredictor420\BackEnd_Predictor\predictor

# Set environment variable
$env:DB_PASSWORD="your_database_password_here"

# Build and run
.\mvnw spring-boot:run
```

### Option 2: Build JAR and Run
```powershell
# Build
.\mvnw clean package -DskipTests

# Run
java -jar target\predictor-0.0.1-SNAPSHOT.jar
```

### Option 3: Docker
```powershell
# Build image
docker build -t college-predictor .

# Run container
docker run -p 8080:8080 -e DB_PASSWORD="your_password" college-predictor
```

---

## ✅ Verify It's Working

### 1. Health Check
Open browser: http://localhost:8080/ping

Expected response:
```
✅ App is working fine!
```

### 2. Test API
Open browser: http://localhost:8080/api/analytics/branches

Expected response:
```json
["CIVIL", "CSE", "ECE", "EEE", ...]
```

### 3. Test with Frontend
1. Open `docs/index.html` in Live Server
2. Search for colleges
3. Try branch comparison

---

## 🔧 Common Issues

### Issue: `DB_PASSWORD environment variable is required`
**Fix**: Set the environment variable before running:
```powershell
$env:DB_PASSWORD="your_actual_password"
```

### Issue: Port 8080 already in use
**Fix**: Kill the process or change port:
```powershell
# Change port
$env:SERVER_PORT=8081

# Or kill process (find PID first)
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: Maven download fails
**Fix**: Check internet connection or use offline mode:
```powershell
.\mvnw clean package -o
```

---

## 📊 Logs Location

When running locally:
- Console output (stdout)
- No file logs by default

When running in Docker:
```bash
docker logs -f college-predictor
```

---

## 🛑 Stop the Application

### Maven:
Press `Ctrl+C` in terminal

### JAR:
Press `Ctrl+C` in terminal

### Docker:
```bash
docker stop college-predictor
```

---

**Ready to deploy?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
