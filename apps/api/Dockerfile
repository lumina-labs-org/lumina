# ------------------------------------------------
# BASE
# ------------------------------------------------

FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@11.11.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install --frozen-lockfile


# ------------------------------------------------
# DEVELOPMENT
# ------------------------------------------------

FROM base AS development

COPY . .

EXPOSE 3333

CMD ["pnpm", "--filter", "@lumina/api", "dev"]


# ------------------------------------------------
# BUILDER
# ------------------------------------------------

FROM base AS builder

COPY . .

RUN pnpm --filter @lumina/api build


# ------------------------------------------------
# PRODUCTION
# ------------------------------------------------

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3333

CMD ["node", "apps/api/dist/server.js"]