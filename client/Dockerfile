FROM node:22-alpine AS builder
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build --workspace=client

FROM nginx:stable-alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]