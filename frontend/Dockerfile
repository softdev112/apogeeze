# Use a Node.js base image
FROM node:latest

# Set working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the entire frontend directory to the container
COPY . .

# Expose port 3000 (React default)
EXPOSE 3000

# Start the React app
CMD ["yarn", "start"]
