# Base image
FROM node:20-slim AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Development stage
FROM base AS development
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Build stage (preparing for production)
FROM base AS build
COPY . .
# No build step required for this plain JS project, 
# but this stage ensures we have all source files.

# Production stage
FROM node:20-slim AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY --from=build /app/src ./src
# Copy drizzle files if they are needed for migrations in production
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/drizzle.config.js ./

# Create a non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nodejs
USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
