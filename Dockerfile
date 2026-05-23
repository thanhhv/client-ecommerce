# =============================================================================
# Stage 1 — Builder
# Installs dependencies and compiles the Next.js application.
# NEXT_PUBLIC_* vars are baked into the JS bundle at build time.
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# =============================================================================
# Stage 2 — Runner
# Copies only the standalone output — no node_modules bulk, no source.
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static     ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/public           ./public

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
