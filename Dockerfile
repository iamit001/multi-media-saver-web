# -------------------------
# Step 1: Clone private repo and build frontend
# -------------------------
FROM node:22 AS build

# Set working directory
WORKDIR /app

# Clone private repo using token
COPY client/package*.json ./client/

# Install frontend dependencies and build
WORKDIR /app/client
RUN npm ci
COPY client/ .
RUN npm run build

# -------------------------
# Stage 2: Setup backend + serve frontend
# -------------------------
FROM node:22-alpine

WORKDIR /app

# Copy backend package files first
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

# Copy backend source
COPY server/ .

# Copy built frontend
COPY --from=build /app/client/build ../client/build

EXPOSE 3001

CMD ["node", "server.js"]
