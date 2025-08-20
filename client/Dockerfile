# Use a lightweight Node.js base image for the development environment.
FROM chirp-packages AS shared-builder
WORKDIR /app

# Start from a base Node.js image.
# We use the 'alpine' variant because it is very small, which results in a smaller image size.
FROM node:22-alpine
WORKDIR /app

# Copy the dependency files to leverage Docker's build cache.
# This layer will only be rebuilt when your package.json changes.
COPY package*.json ./

# Install project dependencies.
RUN npm ci

# Copy the built shared package from the builder stage
COPY --from=shared-builder /app/dist ./node_modules/@chirp/shared/dist

# Copy the client's source code
COPY . .
RUN npm run build