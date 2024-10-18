# Use the official Node.js image as a base
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the Node.js app
CMD ["node", "server.js"]
