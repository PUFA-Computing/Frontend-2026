# ============================================================
# docker/development/Dockerfile — Development Build
# Runs Next.js in standalone mode with remote DB connection
# Usage: docker compose -f docker/development/docker-compose.yml up --build
# ============================================================
FROM node:20-alpine AS base

RUN npm install -g pnpm

# Stage 1: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN pnpm install

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars — must be passed via docker compose build args
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ARG NEXTAUTH_URL=http://localhost:3000
ARG NEXTAUTH_SECRET=""
ARG NEXTAUTH_BASE_PATH=/nextauth
ARG DATABASE_URL=""

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_BASE_PATH=${NEXTAUTH_BASE_PATH}
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client before building
# NOTE: prisma/schema.prisma uses SQLite (file:./dev.db) so no remote DB needed at build time
RUN pnpm exec prisma generate

# Build Next.js (standalone output mode is set in next.config.js)
RUN pnpm run build

# Stage 3: Runtime image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
