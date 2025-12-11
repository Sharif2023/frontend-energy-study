@echo off
echo Starting energy measurement for %1 %2
echo Timestamp: %date% %time%
REM Start Joulemeter or Scaphandre
start chrome --incognito http://localhost:3000
REM Wait 5 seconds, execute operations via Puppeteer
REM Log results to measurements/%1/%2.csv
echo Measurement complete. Thermal reset 10min.
timeout /t 600
