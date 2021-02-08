@echo off

cls
echo instalando...

docker rm -f mysql-db-digital-api

docker build -t mysql-db-digital-api:latest .
docker run -p 10074:80 --name mysql-db-digital-api -d mysql-db-digital-api:latest