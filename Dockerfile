# Step 1: Use an official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy the rest of the source code to /app
COPY . .

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run Prisma generate to include the correct binary targets
RUN yarn prisma generate

# Expose port 5001 for the API
# EXPOSE 5001

# Define health check (optional but recommended)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

# Start the server using Yarn (or npm)
CMD ["yarn", "start"]
