$JAVA_PATH = "C:\Program Files\Java\jdk-17\bin\java.exe"
$MVN_PATH = "C:\apache-maven-3.6.0\bin\mvn.cmd"

Write-Host "Starting Discovery Service..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$MVN_PATH' -f backend/discovery-service/pom.xml spring-boot:run"

Write-Host "Waiting for Discovery Service (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "Starting Product Service..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$MVN_PATH' -f backend/product-service/pom.xml spring-boot:run"

Write-Host "Starting User Service..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$MVN_PATH' -f backend/user-service/pom.xml spring-boot:run"

Write-Host "Starting Order Service..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$MVN_PATH' -f backend/order-service/pom.xml spring-boot:run"

Write-Host "Waiting for services to register (10s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Starting API Gateway..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$MVN_PATH' -f backend/api-gateway/pom.xml spring-boot:run"

Write-Host "All backend services are starting. Please check separate windows." -ForegroundColor Cyan
