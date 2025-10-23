# Backend Build and Deployment Guide

## Issue Fixed
Fixed duplicate `/api/` prefix in all new endpoint paths:
- ❌ Before: `@GetMapping("/api/analytics/summary")` → URL: `/api/api/analytics/summary`
- ✅ After: `@GetMapping("/analytics/summary")` → URL: `/api/analytics/summary`

## Step 1: Test Build Locally

Navigate to the backend directory:
```bash
cd BackEnd_Predictor/predictor
```

Build the project (Windows):
```bash
.\mvnw clean package -DskipTests
```

Or with installed Maven:
```bash
mvn clean package -DskipTests
```

**Expected Output:** `BUILD SUCCESS` and a JAR file in `target/predictor-0.0.1-SNAPSHOT.jar`

## Step 2: Test Locally (Optional)

Run the application locally to verify endpoints:
```bash
.\mvnw spring-boot:run
```

Test the new endpoints at `http://localhost:8080/api/`:
- `GET /analytics/summary` → Returns college statistics
- `POST /reverse-calculator` → Calculates required rank
- `GET /colleges/{instcode}/branches` → Returns available branches

Press `Ctrl+C` to stop the server.

## Step 3: Commit and Push to Git

From the root directory:
```bash
cd ../..
git add .
git commit -m "Fix: Remove duplicate /api prefix from new endpoints"
git push origin main
```

## Step 4: Deploy to Render

### Option A: Auto-Deploy (if connected to Git)
If your Render service is connected to your Git repository, it will automatically detect the push and redeploy.

Check deployment status at: https://dashboard.render.com/

### Option B: Manual Deploy
1. Go to https://dashboard.render.com/
2. Select your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for the build to complete (usually 3-5 minutes)

## Step 5: Verify Deployment

Once deployed, test the endpoints:

**Test Analytics:**
```
https://theeamcetcollegeprediction-2.onrender.com/api/analytics/summary
```

**Test Predict (should still work):**
```
POST https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges
Body: {}
```

## Common Issues

### Issue: "404 Not Found" on new endpoints
**Cause:** Backend not redeployed with new code
**Solution:** Complete Step 4 above

### Issue: "CORS error"
**Cause:** Frontend domain not in allowed origins
**Solution:** Already configured in application.properties (line 31)

### Issue: "Connection timeout"
**Cause:** Render free tier sleeps after inactivity
**Solution:** Wait 30-60 seconds for server to wake up, then retry

## Endpoints Summary

All endpoints are now correctly mapped under `/api/`:

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/predict-colleges | Main prediction endpoint |
| GET | /api/analytics/summary | Overall statistics |
| GET | /api/analytics/branch-stats/{branch} | Branch-specific stats |
| GET | /api/search/by-name?query={name} | Search colleges by name |
| GET | /api/colleges/{instcode}/branches | Get available branches |
| POST | /api/reverse-calculator | Calculate required rank |
| GET | /api/branches/availability?branch={branch} | Colleges offering branch |
| GET | /api/cutoff-distribution/{instcode}/{branch} | Cutoff distribution |
| GET | /api/rankings/by-placement | Placement rankings |
| GET | /api/similar-colleges/{instcode}/{branch} | Similar colleges |
| POST | /api/recommendations | Smart recommendations |

## Next Steps After Deployment

1. Test the main prediction feature on your frontend
2. Test Analytics page
3. Test Calculator page
4. Test Map page
5. Test Branch Comparison page

All features should now work correctly!
