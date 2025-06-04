# ======================================
# Stage 1: Build the frontend (Vue SPA)
# ======================================
FROM node:20 AS frontend-build

ARG VITE_API_URL
ARG VITE_PUSH_SERVER_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PUSH_SERVER_KEY=$VITE_PUSH_SERVER_KEY

WORKDIR /monorepo
COPY . .
RUN npm install

WORKDIR /monorepo/app
RUN npm run build

# ====================================
# Stage 2: Final container setup
# ====================================
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js, Nginx, curl, OpenSSL
RUN apt-get update && apt-get install -y \
    nginx curl openssl gnupg lsb-release ca-certificates \
    && apt-get clean

# Install Node.js 20.x manually to match build stage
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# ========================
# Set up backend
# ========================
WORKDIR /monorepo
COPY . .

WORKDIR /monorepo/backend
RUN npm install

# Provide dummy values at build-time
ARG DATABASE_URL=dummy://user:pass@localhost:5432/dbname
ARG APP_URL=http://localhost
ARG VAPID_EMAIL=
ARG VAPID_PUBLIC_KEY=
ARG VAPID_PRIVATE_KEY=
ARG NODE_ENV=
ARG PORT=2000
ARG SECRET=
ARG REMOVE_TEST_EVENTS_AFTER=
ARG CORS=
ARG RESEND=
ARG ADMIN_EMAIL=
ARG SMTP_HOST=
ARG SMTP_PORT=
ARG SMTP_USERNAME=
ARG SMTP_PASSWORD=

ENV DATABASE_URL=$DATABASE_URL
ENV APP_URL=$APP_URL
ENV VAPID_EMAIL=$VAPID_EMAIL_KEY
ENV VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY
ENV VAPID_PRIVATE_KEY=$VAPID_PRIVATE_KEY
ENV PORT=$PORT
ENV SECRET=$SECRET
ENV REMOVE_EVENTS_AFTER=$REMOVE_EVENTS_AFTER
ENV REMOVE_TEST_EVENTS_AFTER=$REMOVE_TEST_EVENTS_AFTER
ENV CORS=$CORS
ENV RESEND=$RESEND
ENV ADMIN_EMAIL=$ADMIN_EMAIL
ENV SMTP_HOST=$SMTP_HOST
ENV SMTP_PORT=$SMTP_PORT
ENV SMTP_USERNAME=$SMTP_USERNAME
ENV SMTP_PASSWORD=$SMTP_PASSWORD

# ========================
# Set up frontend (SPA)
# ========================
COPY --from=frontend-build /monorepo/app/dist /var/www/html

# ========================
# Set up Nginx
# ========================
RUN rm -f /etc/nginx/sites-enabled/default
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

# ========================
# Add start script
# ========================
COPY ./docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80 4337

CMD ["/start.sh"]
