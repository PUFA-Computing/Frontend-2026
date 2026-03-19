# ============================================================
# docker/production/Dockerfile — Production Build
# Usage: docker compose -f docker/production/docker-compose.yml up -d --build
# ============================================================
FROM node:20-alpine AS base

RUN npm install -g pnpm

# Stage 1: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Secret env vars are passed as build args from CI/CD (GitHub Actions)
# and NOT stored in the image layer — only NEXT_PUBLIC_* is embedded at build time
ARG NEXT_PUBLIC_API_URL=""
ARG NEXTAUTH_URL=""
ARG NEXTAUTH_SECRET=""
ARG DATABASE_URL=""

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client before building
RUN pnpm exec prisma generate

# Build Next.js (standalone output enabled in next.config.js)
RUN pnpm run build

# Stage 3: Minimal runtime image
FROM base AS runner
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
