# ===================================================================
# Stage 1: Build the Next.js static export
# ===================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY . .

# Build static export to /app/out
RUN npm run build

# ===================================================================
# Stage 2: Serve with Nginx
# ===================================================================
FROM nginx:1.27-alpine AS runner

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/out /usr/share/nginx/html

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
