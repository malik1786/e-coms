@echo off
echo Checking and installing dependencies if needed...

IF NOT EXIST "node_modules\" (
    echo Installing root dependencies...
    cmd /c npm install
)

IF NOT EXIST "backend\node_modules\" (
    echo Installing backend dependencies...
    cd backend
    cmd /c npm install
    cd ..
)

IF NOT EXIST "frontend\node_modules\" (
    echo Installing frontend dependencies...
    cd frontend
    cmd /c npm install
    cd ..
)

echo.
echo Starting Nafees Perfumes Server...
node run-dev.js
pause
