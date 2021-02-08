clear
echo instalando...

docker rm -f mysql-db-digital
docker image rm mysql-db-digital:latest

docker rm -f mysql-db-digital-api
docker image rm mysql-db-digital-api:latest



docker network create --subnet=172.18.0.0/16 api-db-network



docker build -t mysql-db-digital:latest . -f Dockerfile.db
docker run --net api-db-network --ip 172.18.0.22 -p 10073:3306 --name mysql-db-digital -d mysql-db-digital:latest

docker build -t mysql-db-digital-api:latest . -f Dockerfile.api
docker run --net api-db-network --ip 172.18.0.23 -p 10074:80 --name mysql-db-digital-api -d mysql-db-digital-api:latest