# Base image
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Development stage
FROM base AS development
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage for production
FROM base AS build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default backend URL (matches docker-compose backend service)
ENV BACKEND_URL=http://backend:3000
# Only substitute BACKEND_URL to prevent breaking native Nginx variables
ENV NGINX_ENVSUBST_FILTER="BACKEND_URL"

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]