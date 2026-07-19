# ===================================================================
# Stage 1: Build the Next.js server app
# ===================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY . .

# Build standalone Next.js output to /app/.next/standalone
RUN npm run build

# ===================================================================
# Stage 2: Run with Node.js
# ===================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Copy standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Run the standalone server with the unprivileged user provided by the Node image
USER node

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/ || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
