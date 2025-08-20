FROM node:22-alpine
WORKDIR /app

# First, copy only the package manifests and lock file
COPY package*.json ./
COPY client/package.json client/
COPY server/package.json server/
COPY packages/package.json packages/

# Install all monorepo dependencies
RUN npm ci

# Now, copy the rest of the source code
COPY . .

# Build the shared packages, which is needed by both client and server
RUN npm run build --workspace=@chirp/packages