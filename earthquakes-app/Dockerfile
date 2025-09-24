# Multi-stage build for Nuxt.js application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NITRO_PORT=4000
ENV NITRO_HOST=0.0.0.0
ENV PORT=4000

# Copy built application from builder stage
COPY --from=builder /app/.output ./

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "server/index.mjs"]
