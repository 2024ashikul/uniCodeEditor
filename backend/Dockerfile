# main-backend/Dockerfile

# --- Stage 1: Build the TypeScript code ---
FROM node:18 AS builder

WORKDIR /usr/src/app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Run the build script to compile TypeScript into JavaScript
RUN npm run build


# --- Stage 2: Create the final, smaller production image ---
FROM node:18-slim

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the compiled code from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist

# The final command points to the compiled server file in the 'dist' folder
CMD [ "node", "dist/server.js" ]