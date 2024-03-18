# AM BigBank Monorepo

## Tools

- [Turborepo](https://turborepo.org)
- [Prisma](https://www.prisma.io)
- [pnpm](https://pnpm.io) (instead of npm or yarn)
- [NestJS](https://nestjs.com)

## Apps

- Frontoffice: Web app for customers
- Backoffice: Web app for employees

## How to ... ?

### Install

Run `pnpm install` in the root folder.

### Start

Run `pnpm run start:dev` in `apps/frontoffice` or `apps/backoffice`.

### Test

Run `pnpm run test` in `apps/frontoffice` or `apps/backoffice`.

### See the swagger documentation

Run the corresponding app and go to `http://localhost:3000/api`.

- [Notifications MS Swagger](http://localhost:3002/api)
- [Users MS Swagger](http://localhost:3003/api)
- [Bank Accounts MS Swagger](http://localhost:3004/api)
- [Transfers MS Swagger](http://localhost:3005/api)

## Docker (Dev Mode)

### Running

```bash
COMPOSE_FILE=docker.compose.dev.yml docker-compose up
```

### Migrate databases

```bash
./docker-compose-migrate.sh
```

### Swaggers in Docker

- [Frontoffice Swagger](http://localhost:8080/api)
- [Notifications MS Swagger](http://localhost:8002/api)
- [Bank Accounts MS Swagger](http://localhost:8003/api)
- [Users MS Swagger](http://localhost:8004/api)
- [Transfers MS Swagger](http://localhost:8005/api)
