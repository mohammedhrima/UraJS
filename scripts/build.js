#!/usr/bin/env node

import { root, config, updateRoutes } from "./utils.js";
import { mkdirSync, writeFileSync, existsSync, readdirSync, copyFileSync } from "fs";
import { join, relative } from "path";
import { logerror, loginfo } from "./debug.js";

const nginx = (port) => `# nginx/nginx.conf
events {
  worker_connections 1024;
}

http {
  include  mime.types;
  default_type  application/octet-stream;

  server {
     listen ${port};

     # Root directory where Nginx serves files
     root /app;

     # Default file to serve
     index index.html;

     location ~ \\.(jsx|tsx|ts)$ {
      rewrite ^(.*)\\.(jsx|tsx|ts)$ $1.js break;
      try_files $uri =404;
     }

     location / {
       try_files $uri $uri.js $uri/ /index.html;
     }
  }
}
`;
const dockerfile = (port) => `
FROM debian:latest

RUN apt-get update && \\
  apt-get install -y nginx && \\
  apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .

WORKDIR /app

EXPOSE 80 ${port}

CMD ["nginx", "-g", "daemon off;"]
  
`;
const dockerCompose = (port) => `
services:
  debian_nginx:
    build: .
    ports:
      - "${port}:${port}"
    volumes:
      - ./app:/app
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    restart: always

`;
const makefile = (port) => `
all: up

up:
	@echo "Starting Docker containers..."
	docker-compose up --build -d

down:
	@echo "Stopping Docker containers..."
	docker-compose down

clean: down
	@echo "Removing Docker volumes..."
	docker volume rm -f $$(docker volume ls -q --filter name=$(PROJECT_NAME)_*)

fclean: down
	@echo "Cleaning Docker system..."
	docker system prune -af
	docker volume prune -f
	docker network prune -f

logs:
	@echo "Showing logs..."
	docker-compose logs -f

re: clean all

.PHONY: all build up down clean fclean logs re
`;

function createFile(filePath, data) {
  if (!existsSync(filePath)) {
    try {
      writeFileSync(filePath, data);
      loginfo(relative(root, filePath), "created and data written successfully.");
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

function copyDir(src, dest) {
  loginfo("copy", src);
  mkdirSync(dest, { recursive: true });
  readdirSync(src, { withFileTypes: true }).forEach(entry => {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else copyFileSync(srcPath, destPath);
  });
}

(async ()=>{
  try {
    const holder = await import(join(root, "ura.config.js"));
    holder.default();
    
    let port = config.port;
    loginfo("available port", port);
  
    ["./docker/app", "./docker/nginx"].map((subDir) => {
      mkdirSync(join(root, subDir), { recursive: true }, (err) => {
        if (err) logerror("Error:", err);
        else {
          loginfo("build directory created successfully or already exists.");
        }
      });
    });
  
    updateRoutes();
    createFile(join(root, "./docker/nginx/nginx.conf"), nginx(port));
    createFile(join(root, "./docker/Dockerfile"), dockerfile(port));
    createFile(join(root, "./docker/docker-compose.yml"), dockerCompose(port));
    createFile(join(root, "./docker/Makefile"), makefile(port));
  
    copyDir(join(root, "./out"), join(root, "./docker/app"))
  } catch (error) {
    logerror(error)
  }
})()
