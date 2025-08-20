# Use a lightweight Node.js base image for the development environment.
FROM node:22-alpine
WORKDIR /app

# Copy the dependency files to leverage Docker's build cache.
# This layer will only be rebuilt when your package.json changes.
COPY package*.json ./

# Install project dependencies.
RUN npm ci

# Copy the rest of your application's source code into the container.
COPY . .

# Build the shared package for production.
RUN npm run build