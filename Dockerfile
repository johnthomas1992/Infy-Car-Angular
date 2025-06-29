# Use Node.js image for building the application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application source code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use Nginx image for serving the application
FROM nginx:1.21.6-alpine AS runtime

# Copy built application from the build stage to Nginx's html directory
COPY --from=build /app/dist/infy-car /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]

