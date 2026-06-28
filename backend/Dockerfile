# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose application port
EXPOSE 5000

# Start application
CMD ["npm", "start"]