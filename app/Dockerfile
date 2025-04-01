FROM node:20 AS build

WORKDIR /monorepo
COPY . .
RUN npm install

WORKDIR /monorepo/app
RUN npm run build

FROM nginx:stable-alpine AS production-stage
COPY --from=build /monorepo/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
