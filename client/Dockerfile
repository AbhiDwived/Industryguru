# Use Node.js 18 for better compatibility
FROM node:18-alpine

WORKDIR /app

# Set memory limit for Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package files
COPY package.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps --production=false

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodeuser && \
    chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000", "-n"]