@echo off
echo ====================================
echo Starting Food Ordering Application
echo ====================================
echo.

echo [1/3] Checking database connection...
node test-db-connection.js
if errorlevel 1 (
    echo ERROR: Database connection failed!
    pause
    exit /b 1
)
echo.

echo [2/3] Starting Backend Server on port 3001...
start "Backend Server" cmd /k "node src/server.js"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend Development Server on port 8080...
start "Frontend Server" cmd /k "cd ..\frontend && npm run dev"

echo.
echo ====================================
echo Both servers are starting!
echo ====================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:8080
echo.
echo Admin Access:
echo Email: ahmad.wais.sarwari786@gmail.com
echo Password: Wais@1234
echo.
echo Press any key to exit this window...
pause >nul
