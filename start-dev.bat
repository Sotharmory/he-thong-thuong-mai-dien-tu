@echo off
echo Starting development environment...

REM Start MongoDB (assumes MongoDB is installed and in PATH)
echo Starting MongoDB...
start "MongoDB" mongod

REM Wait for MongoDB to start
timeout /t 5

REM Start Spring Boot backend
echo Starting Spring Boot backend...
cd backend-mongodb
start "Spring Boot" mvn spring-boot:run

REM Wait for backend to start
timeout /t 10

REM Start Angular frontend
echo Starting Angular frontend...
cd ../admin-website
start "Angular" npm start

echo Development environment is starting up...
echo Backend will be available at http://localhost:8080/api
echo Frontend will be available at http://localhost:4200 