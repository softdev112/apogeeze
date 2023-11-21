# Use a Node.js base image
FROM node:latest

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire backend directory to the container
COPY . .

# Expose port 5000 (Express default)
EXPOSE 5000

# Start the Node.js server
CMD ["node", "server.js"]
