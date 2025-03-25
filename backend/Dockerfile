FROM node:18

# Use a consistent working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

# Start the server only when the container runs (not during build)
CMD ["npm", "run", "start"]
