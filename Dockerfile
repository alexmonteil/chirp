# Start from a base Node.js image.
# We use the 'alpine' variant because it is very small, which results in a smaller image size.
FROM node:22-alpine

# Set the working directory inside the container to /app.
# All subsequent commands will be run from this directory.
WORKDIR /app

# Copy the package.json and package-lock.json files from your local machine
# into the /app directory of the container.
# This step is done separately to take advantage of Docker's layer caching.
COPY package*.json ./

# Install the project dependencies.
# The `npm ci` command is similar to `npm install` but it's faster and more reliable
# in a CI/CD environment because it installs dependencies based on the `package-lock.json` file.
RUN npm ci

# Copy the rest of your application's source code into the container.
COPY . .

# Tell Docker that the container will listen on a specific port.
# This is a documentation step, it doesn't actually publish the port.
EXPOSE 3000

# Specify the command to run when the container starts.
# We use the 'npm run dev' command, assuming you have it configured to start your app.
# In production, you would typically use `npm start`.
CMD [ "npm", "run", "dev" ]