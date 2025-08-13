# Use a lightweight Node.js base image for the development environment.
FROM node:22-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy the dependency files to leverage Docker's build cache.
# This layer will only be rebuilt when your package.json changes.
COPY package*.json ./

# Install project dependencies.
RUN npm ci