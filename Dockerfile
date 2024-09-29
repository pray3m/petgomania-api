# Step 1: Use an official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the source code to /app
COPY . .

# Expose port 5001 for the API
EXPOSE 5001

# Start the server using Yarn (or npm)
CMD ["yarn", "start"]
