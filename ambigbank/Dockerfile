FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
RUN apt-get update -y && apt-get install -y openssl
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=./apps/notifications --prod /prod/notifications
RUN pnpm deploy --filter=./apps/bank-accounts --prod /prod/bank-accounts
RUN pnpm deploy --filter=./apps/users --prod /prod/users
RUN pnpm deploy --filter=./apps/transfers --prod /prod/transfers
RUN pnpm deploy --filter=./apps/frontoffice --prod /prod/frontoffice

FROM base AS notifications
COPY --from=build /prod/notifications /prod/notifications
WORKDIR /prod/notifications
EXPOSE 8001
CMD [ "pnpm", "start" ]

FROM base AS bank-accounts
RUN apt-get update -y && apt-get install -y openssl
COPY --from=build /prod/bank-accounts /prod/bank-accounts
WORKDIR /prod/bank-accounts
EXPOSE 8001
CMD [ "pnpm", "start" ]

FROM base AS users
RUN apt-get update -y && apt-get install -y openssl
COPY --from=build /prod/users /prod/users
WORKDIR /prod/users
EXPOSE 8002
CMD [ "pnpm", "start" ]

FROM base AS transfers
RUN apt-get update -y && apt-get install -y openssl
COPY --from=build /prod/transfers /prod/transfers
WORKDIR /prod/transfers
EXPOSE 8003
CMD [ "pnpm", "start" ]

FROM base AS frontoffice
COPY --from=build /prod/frontoffice /prod/frontoffice
WORKDIR /prod/frontoffice
EXPOSE 8004
CMD [ "pnpm", "start" ]
