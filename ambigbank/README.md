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

### Update the database schema

Go to `packages/db` and run `pnpm run prisma:generate` and `pnpm run prisma:migrate`.

### See the database

Go to `packages/db` and run `pnpm exec prisma studio`.
