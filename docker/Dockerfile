# Dockerfile
FROM debian:latest

# Install Nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy custom Nginx config file to override the default
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Set the /app directory to serve files
WORKDIR /app

# Expose port 80 to allow access to Nginx from outside
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
