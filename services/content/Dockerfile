# Use lightweight Node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy remaining source code
COPY . .

# Expose internal port (change per service)
EXPOSE 5002

# Start application
CMD ["node", "server.js"]