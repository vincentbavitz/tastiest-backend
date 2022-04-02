# Tastiest Backend - NestJS

## Starting with PM2
```bash
pm2 start yarn --interpreter bash --name tastiest-backend -- start
```

## Grab Postgres internal IPs
You might want to do this to start a new server from pgAdmin etc.

https://stackoverflow.com/a/60668718

1. Grab network ID
```bash
sudo docker ps
```
2. Grab internal IP
```bash
docker container inspect -f '{{ .NetworkSettings.IPAddress }}' {network_id_from_above}
```

## Serving Documentation
```bash
yarn documentation:serve
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
