@echo off
echo Stopping Next.js server on port 3000...

REM Kill processes on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo Starting Next.js server...
npm run dev

pause
