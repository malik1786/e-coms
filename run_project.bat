@echo off
echo.
echo ==========================================
echo   Sufi Perfumes - Setup ^& Startup Script
echo ==========================================
echo.

echo [Step 1/4] Installing Backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install backend dependencies.
    pause
    exit /b %ERRORLEVEL%
)

echo [Step 2/4] Starting Backend server in a new window...
start "Backend Server" cmd /k "npm run dev"

echo [Step 3/4] Installing Frontend dependencies...
cd ../frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies.
    pause
    exit /b %ERRORLEVEL%
)

echo [Step 4/4] Starting Frontend server in a new window...
start "Frontend Server" cmd /k "npm run dev"

echo [Step 5/6] Installing Admin Mobile dependencies...
cd ../admin-mobile-app
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install admin mobile dependencies.
    pause
    exit /b %ERRORLEVEL%
)

echo [Step 6/6] Starting Admin Mobile in a new window...
start "Admin Mobile" cmd /k "npm run dev"

echo.
echo ==========================================
echo   All systems (Web, Admin, API) are live! 
echo ==========================================
echo.
pause
