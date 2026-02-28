# Use lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy remaining source code
COPY . .

# Expose internal port (change per service)
EXPOSE 5004

# Start application
CMD ["node", "server.js"]