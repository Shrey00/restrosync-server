# Stage 1: Build the TypeScript code
FROM node:20 AS builder

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript files
RUN npm run build

# Stage 2: Serve the built files
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy only the built files and necessary packages from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port your app runs on
EXPOSE 8080

# Start the Node.js app
CMD ["npm", "start"]
