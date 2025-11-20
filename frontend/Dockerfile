# Frontend Dockerfile
# Multi-stage build for production optimization

# Stage 1: Base
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage 2: Development
FROM base AS development
RUN npm install
COPY . .

# Build args for development
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 3: Build production files
FROM base AS build
RUN npm ci
COPY . .

# Build args for production - IMPORTANT!
ARG VITE_API_URL=http://188.213.199.116/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 4: Production with nginx
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=build /app/dist /usr/sh
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
