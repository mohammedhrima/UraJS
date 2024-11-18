
FROM debian:latest

RUN apt-get update && \
  apt-get install -y nginx && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

EXPOSE 80 17000

CMD ["nginx", "-g", "daemon off;"]
  
