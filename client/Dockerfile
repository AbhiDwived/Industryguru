# Use Node 16 for better stability
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Set environment variables for build optimization
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV GENERATE_SOURCEMAP=false

# Copy package.json only first for better caching
COPY package.json ./

# Clean install with specific flags to avoid build issues
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy all source files
COPY . .

# Build with error handling
RUN npm run build || (echo "Build failed, checking logs..." && exit 1)

# Install serve
RUN npm install -g serve@14.2.0

# Create user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodeuser && \
    chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000

# Start with serve
CMD ["serve", "-s", "dist", "-l", "3000", "-n"]