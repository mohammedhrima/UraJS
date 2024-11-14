import fs from "fs";
import path from "path";
import UTILS from "./utils.js";
const { SET, GET, CHECK_PORT, UPDATE_ROUTES, COPY, INIT } = UTILS;

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
       try_files $uri $uri/ /index.html;
     }
  }
}
`;
const dockerfile = (port) => `
FROM debian:latest

RUN apt-get update && \\
  apt-get install -y nginx && \\
  apt-get clean && rm -rf /var/lib/apt/lists/*

COPY nginx/nginx.conf /etc/nginx/nginx.conf

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
    restart: always

`;
const makefile = (port) => `
all: # start container
	docker-compose up -d

down: # stop container
	docker-compose down

list: # list container
	docker ps --format "{{.Names}} {{.ID}}"

clean: down # clear
	@docker system prune -a -f
	@docker volume prune -f
	@docker image prune -f
	@docker network prune -f
	@dangling_volumes=$$(docker volume ls -q --filter dangling=true); \\
    if [ $$? -eq 0 ]; then \\
        for volume in $$dangling_volumes; do \\
            docker volume rm $$volume; \\
        done; \\
    fi

re: clean all
`;

CHECK_PORT(GET("PORT"), (isInUse, availablePort, error) => {
  INIT();
  SET("TYPE", "build");
  UPDATE_ROUTES();
  COPY(GET("SOURCE"));  

  let port = availablePort;
  console.log("final port", port);
  // process.exit(1);

  ["./docker/app", "./docker/nginx"].map((subDir) => {
    fs.mkdirSync(path.join(GET("ROOT"), subDir), { recursive: true }, (err) => {
      if (err) {
        console.error("Error:", err);
      } else {
        console.log("build directory created successfully or already exists.");
      }
    });
  });

  async function createFile(filePath, data) {
    try {
      await fs.writeFileSync(filePath, data);
      console.log("File created and data written successfully.");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async function copyDir(src, dest) {
    await fs.mkdirSync(dest, { recursive: true });
    const entries = await fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) await copyDir(srcPath, destPath);
      else await fs.copyFileSync(srcPath, destPath);
    }
  }

  createFile(path.join(GET("ROOT"), "./docker/nginx/nginx.conf"), nginx(port));
  createFile(path.join(GET("ROOT"), "./docker/Dockerfile"), dockerfile(port));
  createFile(
    path.join(GET("ROOT"), "./docker/docker-compose.yml"),
    dockerCompose(port)
  );
  createFile(path.join(GET("ROOT"), "./docker/Makefile"), makefile(port));

  fs.copyFileSync(
    path.join(GET("ROOT"), "./index.html"),
    path.join(GET("ROOT"), "./docker/app/index.html")
  );

  copyDir(
    path.join(GET("ROOT"), "./out"),
    path.join(GET("ROOT"), "./docker/app")
  )
    .then(() => console.log("All files copied successfully."))
    .catch((err) => console.error("Error during copy:", err));
  SET("type", "dev");
});
