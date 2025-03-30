FROM node:20

WORKDIR /backend

# Accept the build arg
ARG DATABASE_URL

# Set it as an environment variable (now available to RUN steps)
ENV DATABASE_URL=${DATABASE_URL}

# Install system tools (like MySQL client, openssl for SECRET, etc.)
RUN apt-get update && apt-get install -y default-mysql-client openssl

# Install dependencies early (cached by Docker)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# 🔽 Download wait-for-it.sh during build
RUN curl -o /usr/local/bin/wait-for-it https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
  && chmod +x /usr/local/bin/wait-for-it

# We don't need this since we run npx prisma migrate deploy in the ENTRYPOINT
# RUN npm run build

# Expose backend port
EXPOSE 2000

# Set entrypoint that generates a SECRET and starts the app
ENTRYPOINT ["sh", "-c", "export SECRET=$(openssl rand -base64 32) && npx prisma migrate deploy && npx prisma generate && npm start"]
