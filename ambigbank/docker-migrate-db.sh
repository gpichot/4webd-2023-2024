#!/bin/sh

docker-compose exec -it users sh -c 'cd apps/users && pnpm exec prisma migrate deploy'
docker-compose exec -it bank-accounts sh -c 'cd apps/bank-accounts && pnpm exec prisma migrate deploy'
docker-compose exec -it transfers sh -c 'cd apps/transfers && pnpm exec prisma migrate deploy'
