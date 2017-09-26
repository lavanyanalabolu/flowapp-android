@echo off
cls
echo "Test suite is starting"
call mvn clean test -U
echo Test Suite run has completed... 
echo Please Press anything to exit :D
Pause>Nul