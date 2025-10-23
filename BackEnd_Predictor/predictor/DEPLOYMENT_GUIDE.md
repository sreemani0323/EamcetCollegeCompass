# Backend Deployment Guide

## 🚀 Deployment Fixes Applied

### Issues Fixed

1. ✅ **Missing Deployment Configuration Files**
   - Added `render.yaml` for Render.com deployment
   - Added `.dockerignore` to reduce Docker image size
   - Added `application-prod.properties` for production settings

2. ✅ **Dockerfile Optimization**
   - **Multi-stage build** with dependency caching
   - **Alpine-based JRE** (smaller image size: ~150MB vs 300MB)
   - **Non-root user** for security
   - **Health check** built-in
   - **Container-optimized JVM settings**

3. ✅ **Application Configuration**
   - Dynamic port binding: `${PORT:8080}` (required for Render.com)
   - Graceful shutdown support
   - Production-ready connection pool settings
   - Optimized logging (INFO level in production)
   - Database connection resilience (auto-reconnect, leak detection)

4. ✅ **CORS Configuration**
   - Multiple allowed origins (GitHub Pages + localhost)
   - Proper headers and methods
   - OPTIONS preflight support

5. ✅ **Health Checks**
   - `/ping` endpoint for health monitoring
   - `/` root endpoint for basic checks
   - Actuator endpoints enabled (`/actuator/health`, `/actuator/info`)

---

## 📋 Pre-Deployment Checklist

### Required Environment Variables

On Render.com dashboard, set these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `DB_PASSWORD` | Your database password | ✅ YES |
| `SPRING_PROFILES_ACTIVE` | `prod` | Recommended |
| `JAVA_OPTS` | `-Xmx512m -Xms256m` | Optional |

### Database Requirements

Ensure your MySQL database is accessible:
- Host: `mysql-13161f4b-sreemani0323-3de4.d.aivencloud.com`
- Port: `10573`
- Database: `defaultdb`
- Username: `avnadmin`
- SSL: Required

---

## 🎯 Deployment Methods

### Method 1: Render.com (Recommended)

#### Step 1: Prepare Repository
```bash
cd BackEnd_Predictor/predictor
git add .
git commit -m "Add deployment configuration"
git push origin main
```

#### Step 2: Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Set environment variables:
   - `DB_PASSWORD`: Your database password
6. Click **"Create Web Service"**

#### Step 3: Monitor Deployment
- Build logs will show Maven build progress
- Health check: `https://your-app.onrender.com/ping`
- API test: `https://your-app.onrender.com/api/analytics/branches`

---

### Method 2: Docker Local Testing

```bash
# Build Docker image
cd BackEnd_Predictor/predictor
docker build -t college-predictor-backend .

# Run container
docker run -d \
  -p 8080:8080 \
  -e DB_PASSWORD="your_password_here" \
  -e SPRING_PROFILES_ACTIVE=prod \
  --name college-predictor \
  college-predictor-backend

# Check logs
docker logs -f college-predictor

# Test endpoints
curl http://localhost:8080/ping
curl -X POST http://localhost:8080/api/predict-colleges \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### Method 3: Manual Maven Build

```bash
cd BackEnd_Predictor/predictor

# Set environment variable (Windows PowerShell)
$env:DB_PASSWORD="your_password_here"

# Or (Windows CMD)
set DB_PASSWORD=your_password_here

# Build
./mvnw clean package -DskipTests

# Run
java -jar target/predictor-0.0.1-SNAPSHOT.jar
```

---

## 🔍 Verification Steps

### 1. Health Check
```bash
curl https://your-app.onrender.com/ping
# Expected: ✅ App is working fine!
```

### 2. Database Connection
```bash
curl https://your-app.onrender.com/actuator/health
# Expected: {"status":"UP","components":{"db":{"status":"UP"}}}
```

### 3. API Endpoints
```bash
# Test new branches endpoint
curl https://your-app.onrender.com/api/analytics/branches
# Expected: ["CIVIL","CSE","ECE",...]

# Test college prediction
curl -X POST https://your-app.onrender.com/api/predict-colleges \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: Array of colleges
```

### 4. CORS Test
Open browser console on `https://sreemani0323.github.io/CollegePredictor420`:
```javascript
fetch('https://your-app.onrender.com/api/analytics/branches')
  .then(r => r.json())
  .then(console.log);
// Should work without CORS errors
```

---

## 🐛 Troubleshooting

### Issue: "DB_PASSWORD environment variable is required"
**Solution**: Set `DB_PASSWORD` in Render environment variables

### Issue: "Connection refused" or timeout
**Solutions**:
1. Check database firewall allows Render IP ranges
2. Verify database credentials
3. Check Render logs for connection errors

### Issue: Docker build fails
**Solutions**:
1. Ensure Java 21 is available
2. Check Maven can download dependencies
3. Verify `pom.xml` is valid:
   ```bash
   ./mvnw validate
   ```

### Issue: Application crashes on startup
**Check logs for**:
- Database connection errors
- Port already in use
- Missing environment variables
- Memory issues (increase JAVA_OPTS)

### Issue: CORS errors from frontend
**Solutions**:
1. Verify `application.properties` has correct origins
2. Check browser developer tools for exact error
3. Ensure OPTIONS requests are allowed

---

## 📊 Performance Optimization

### Current Settings
- **Connection Pool**: 5 max, 2 min idle connections
- **JVM Memory**: 75% of container RAM (adaptive)
- **Timeouts**: 30s connection, 60s idle
- **Health Checks**: Every 30s

### For Free Tier (Render.com)
- Memory: 512MB
- CPU: Shared
- Auto-sleep: After 15min inactivity
- **First request after sleep: ~30-60s wake-up time**

### Production Recommendations
- Upgrade to **Starter plan** ($7/month) for:
  - No auto-sleep
  - Faster CPU
  - 512MB+ memory
  - Better performance

---

## 🔐 Security Checklist

- ✅ Database password via environment variable (not hardcoded)
- ✅ Non-root Docker user
- ✅ HTTPS only (Render provides SSL certificate)
- ✅ CORS restricted to specific origins
- ✅ SQL injection protected (JPA/Hibernate)
- ✅ No sensitive data in logs
- ✅ Actuator endpoints secured

---

## 📁 Deployment Files Summary

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage Docker build |
| `.dockerignore` | Reduce Docker context size |
| `render.yaml` | Render.com configuration |
| `application.properties` | Main configuration |
| `application-prod.properties` | Production overrides |
| `pom.xml` | Maven dependencies |

---

## 🎯 Post-Deployment Tasks

1. **Update Frontend URLs**
   - Replace all `https://theeamcetcollegeprediction-2.onrender.com` with your new URL
   - Files to update:
     - `docs/branch-comparison.js`
     - `docs/script.js`
     - Any other fetch() calls

2. **Test All Features**
   - College prediction
   - Branch comparison
   - Map view
   - Analytics

3. **Monitor Logs**
   - Watch for errors in Render logs
   - Check database connection stability
   - Monitor response times

4. **Set Up Alerts**
   - Enable Render email notifications
   - Monitor uptime (use UptimeRobot or similar)

---

## 📞 Support

### Render.com Logs
```bash
# View in dashboard or CLI
render logs -s your-service-name --tail
```

### Common Log Messages

✅ **Good**:
```
Application configuration validated successfully
Started PredictorApplication in 5.2 seconds
```

❌ **Bad**:
```
DB_PASSWORD environment variable is required but not set
Failed to obtain JDBC Connection
OutOfMemoryError
```

---

## 🚀 Quick Deploy Command

If everything is configured:
```bash
# Commit and push
git add .
git commit -m "Backend deployment ready"
git push origin main

# Render will auto-deploy if connected
```

---

**Status**: ✅ Backend is deployment-ready!  
**Estimated Deploy Time**: 3-5 minutes  
**Health Check**: `/ping` endpoint  

Good luck with deployment! 🎉
