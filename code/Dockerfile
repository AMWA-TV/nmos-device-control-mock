# Use the official Ubuntu 24.04 LTS as the base image
FROM ubuntu:24.04

# Set environment variables to avoid interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install necessary dependencies for Node.js
# curl is needed to fetch the NodeSource setup script
# gnupg is needed to verify the authenticity of the downloaded packages
RUN apt-get update && \
    apt-get install -y curl gnupg2 && \
    rm -rf /var/lib/apt/lists/*

# Import the NodeSource GPG key
# This ensures that the packages you download are from a trusted source
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

# Add the NodeSource APT repository for Node.js 20.x
# Node.js 20.x is a current LTS (Long Term Support) version
# The architecture is dynamically detected using $(dpkg --print-architecture)
ENV NODE_MAJOR=20
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

# Update the package list again to include the new NodeSource repository
# Install Node.js and npm
# npm is installed automatically with nodejs
RUN apt-get update && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Verify Node.js and npm installation
RUN node -v
RUN npm -v

# Set the working directory
WORKDIR /app

# Copy application code into the container
COPY . /app

# Install application dependencies
RUN npm install

# Build application
RUN npm run build

# Create a new "config" directory inside /app/server if it doesn't already exist
RUN mkdir -p /app/server/config

# Remove config.json if it exists (the config volume will be mapped into the container from the host)
RUN rm -f /app/server/config/config.json

# Expose a port
EXPOSE 8080

# Define the command to run the application when the container starts
CMD ["node", "dist/server/Server.js"]
