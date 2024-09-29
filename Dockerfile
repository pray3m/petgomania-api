# Step 1: Use an official Node.js image as the base
FROM node:18

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the source code to /app
COPY . .

# Expose the port your Node.js server runs on (e.g., 5001)
EXPOSE 5001

# Start the server using Yarn
CMD ["yarn", "start"]
