FROM node:20 AS build


ARG VITE_API_URL
ARG VITE_PUSH_SERVER_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PUSH_SERVER_KEY=$VITE_PUSH_SERVER_KEY

WORKDIR /monorepo
COPY . .
RUN npm install

WORKDIR /monorepo/app

RUN echo "VITE_APP_URL=$VITE_API_URL" && echo "VITE_PUSH_SERVER_KEY=$VITE_PUSH_SERVER_KEY"

RUN npm run build

FROM nginx:stable-alpine AS production-stage

# Copy build output
COPY --from=build /monorepo/app/dist /usr/share/nginx/html

# Add custom nginx config
COPY ./app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
