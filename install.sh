clear
echo instalando...

docker rm -f ativa-mais-db
docker image rm ativa-mais-db:latest

docker rm -f ativa-mais-db-api
docker image rm ativa-mais-db-api:latest



docker network create --subnet=172.18.0.0/16 api-db-network



docker build -t ativa-mais-db:latest . -f Dockerfile.db
docker run --net api-db-network --ip 172.18.0.22 -p 10073:3306 --name ativa-mais-db -d ativa-mais-db:latest

docker build -t ativa-mais-db-api:latest . -f Dockerfile.api
docker run --net api-db-network --ip 172.18.0.23 -p 10074:80 --name ativa-mais-db-api -d ativa-mais-db-api:latest