#!/bin/bash

echo "========================================"
echo "Starting Admin Dashboard Development"
echo "========================================"

echo ""
echo "[1/4] Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "ERROR: MongoDB not found. Please install MongoDB first."
    exit 1
fi

echo "MongoDB found!"

echo ""
echo "[2/4] Starting MongoDB service..."
# Try to start MongoDB service
if command -v systemctl &> /dev/null; then
    sudo systemctl start mongod 2>/dev/null || echo "MongoDB already running or failed to start"
elif command -v brew &> /dev/null; then
    brew services start mongodb-community 2>/dev/null || echo "MongoDB already running or failed to start"
else
    mongod --fork --logpath /var/log/mongod.log 2>/dev/null || echo "Starting MongoDB manually..."
fi

echo ""
echo "[3/4] Starting Backend API (MongoDB)..."
cd backend-mongodb
gnome-terminal -- bash -c "mvn spring-boot:run; exec bash" 2>/dev/null || \
xterm -e "mvn spring-boot:run" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && mvn spring-boot:run"' 2>/dev/null || \
(mvn spring-boot:run &)

echo ""
echo "[4/4] Starting Frontend (Angular)..."
sleep 10
cd ../admin-website
gnome-terminal -- bash -c "npm start; exec bash" 2>/dev/null || \
xterm -e "npm start" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm start"' 2>/dev/null || \
(npm start &)

echo ""
echo "========================================"
echo "Development environment started!"
echo "========================================"
echo ""
echo "Backend API: http://localhost:8081/api"
echo "Frontend:    http://localhost:4200"
echo ""
echo "Press any key to continue..."
read -n 1 