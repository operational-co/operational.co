FROM node:20 AS build


ARG VITE_API_URL
ARG VITE_PUSH_SERVER_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PUSH_SERVER_KEY=$VITE_PUSH_SERVER_KEY

WORKDIR /monorepo
COPY . .
RUN npm install

WORKDIR /monorepo/app
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build /monorepo/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
