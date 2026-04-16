@echo off
echo Creating a lightweight zip file for sharing...
echo Skipping heavy node_modules folders automatically.
echo Please wait, this might take a minute...

set SRC=%~dp0
set SRC=%SRC:~0,-1%
set TMPDIR=%TEMP%\client2_share_tmp
set DEST=%~dp0..\client2_share.zip

if exist "%DEST%" del /f /q "%DEST%"
if exist "%TMPDIR%" rd /s /q "%TMPDIR%"
mkdir "%TMPDIR%"

robocopy "%SRC%" "%TMPDIR%" /E /XD node_modules .git dist /XF client2_share.zip /NFL /NDL /NJH /NJS /NC /NS /NP >nul

powershell -NoProfile -Command "Compress-Archive -Path '%TMPDIR%\*' -DestinationPath '%DEST%' -Force"

rd /s /q "%TMPDIR%"

echo.
echo ==============================================
echo Success! The zip file has been created.
echo You can find it in the "bussiness works" folder as "client2_share.zip".
echo ==============================================
pause
