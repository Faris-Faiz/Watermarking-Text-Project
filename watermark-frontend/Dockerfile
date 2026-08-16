# syntax=docker/dockerfile:1

# ---- deps: install dependencies from the bun lockfile ----
# Debian-based (glibc) image: Bun currently segfaults on Alpine/musl arm64
# during the build's worker-thread teardown (see oven-sh/bun crash reports).
FROM oven/bun:1-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- builder: build the Next.js standalone output ----
# Plain Node.js here, not bun: Bun 1.3.x segfaults on arm64 during its
# worker-thread teardown right after `next build` finishes (upstream bug,
# not a build failure) - node_modules from the deps stage work fine with it.
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time,
# so this must be supplied as a build arg, not a runtime env var.
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

RUN node node_modules/.bin/next build

# ---- runner: minimal production image ----
# Debian-based (glibc), matching the builder: sharp's native binary is
# built for glibc there and won't load under Alpine's musl libc.
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["node", "server.js"]
