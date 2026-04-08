# --------- Base Stage ---------
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# --------- Development Stage ---------
FROM base AS dev
# Install all dependencies (including devDependencies)
RUN npm install
COPY . .
# Expose Vite's default dev server port
EXPOSE 5173
# Start dev server, bind to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --------- Builder Stage ---------
FROM base AS builder
# Use ci for reliable, reproducible builds
RUN npm ci
COPY . .
# Build the application
RUN npm run build

# --------- Production Stage ---------
FROM nginx:alpine AS prod
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
