# This stage is responsible for building your shared package.
FROM chirp-packages AS shared-builder
WORKDIR /app

# Start from a base Node.js image.
# We use the 'alpine' variant because it is very small, which results in a smaller image size.
FROM node:22-alpine
WORKDIR /app

# Copy the package.json and package-lock.json files from your local machine
COPY package*.json ./

# Install the project dependencies.
RUN npm ci

# Copy the built shared package from the builder stage
COPY --from=shared-builder /app/dist ./node_modules/@chirp/shared/dist

# Copy the rest of your application's source code into the container.
COPY . .

# Tell Docker that the container will listen on a specific port.
# This is a documentation step, it doesn't actually publish the port.
EXPOSE 3000

# Specify the command to run when the container starts.
# We use the 'npm run dev' command, assuming you have it configured to start your app.
# In production, you would typically use `npm start`.
CMD [ "npm", "run", "dev" ]