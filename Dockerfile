# Use the official Node.js image as a base
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists) and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Compile TypeScript files to JavaScript
RUN tsc

# Expose the port your app runs on
EXPOSE 4000

# Start the Node.js app (replace 'server.js' with your compiled entry point, usually in the 'dist' folder)
CMD ["node", "dist/server.js"]
