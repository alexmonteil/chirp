FROM node:22-alpine
WORKDIR /app

# Copy all necessary files for the monorepo's build
COPY . .

# Install dependencies for the entire workspace
RUN npm install

EXPOSE 3000
# Command to run the server's dev script within the workspace
CMD ["npm", "run", "dev", "--workspace=server"]