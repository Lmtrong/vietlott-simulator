@echo off
cd /d "%~dp0"
echo Dang khoi dong server VIETLOTT SIMULATOR...
echo Trinh duyet se tu dong mo ngay khi server san sang!
call npm.cmd run dev -- --open
pause
