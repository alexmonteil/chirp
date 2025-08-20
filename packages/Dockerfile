# Stage 1: Build the shared package
FROM node:22-alpine
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the source code and build the app for production
COPY . .
RUN npm run build