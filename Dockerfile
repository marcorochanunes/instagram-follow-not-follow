# Step 1: Use Node.js as the base image
FROM node:20.13.1 AS development

ENV NODE_ENV development

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files first for dependency caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project code
COPY . .

# Expose port 4200
EXPOSE 4200

# Command to properly start the Angular application
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
