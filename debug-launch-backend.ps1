$LOG_DIR = "C:\Temp\logs"
if (!(Test-Path $LOG_DIR)) { New-Item -ItemType Directory -Path $LOG_DIR }

$MVN_PATH = "C:\apache-maven-3.6.0\bin\mvn.cmd"

function Start-Service($name, $path) {
    Write-Host "Starting $name..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-Command", "& '$MVN_PATH' -f $path spring-boot:run 2>&1 | Out-File -FilePath '$LOG_DIR\$name.log' -Encoding utf8"
}

Write-Host "Killing existing Java processes..." -ForegroundColor Red
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force

Start-Service "discovery-service" "backend/discovery-service/pom.xml"
Write-Host "Waiting for Discovery Service (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Start-Service "product-service" "backend/product-service/pom.xml"
Start-Service "user-service" "backend/user-service/pom.xml"
Start-Service "order-service" "backend/order-service/pom.xml"
Write-Host "Waiting for services to register (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Start-Service "api-gateway" "backend/api-gateway/pom.xml"
Write-Host "All backend services are starting. Check logs in $LOG_DIR" -ForegroundColor Cyan
