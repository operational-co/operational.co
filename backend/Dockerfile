FROM node:20

WORKDIR /backend

# Install system tools (like MySQL client, openssl for SECRET, etc.)
RUN apt-get update && apt-get install -y default-mysql-client openssl

# Install dependencies early (cached by Docker)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Optional: Build step (e.g. transpile TypeScript, etc.)
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 2000

# Set entrypoint that generates a SECRET and starts the app
ENTRYPOINT ["sh", "-c", "export SECRET=$(openssl rand -base64 32) && npm run start"]
