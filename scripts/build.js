import { root, SET, GET, parse_config_file } from "./utils.js";
import { mkdirSync, writeFileSync, existsSync, readdirSync, copyFileSync } from "fs";
import { join ,relative} from "path";
import net from "net";
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


function getAvailablePort(port) {
  const isAvailable = (port) =>
    new Promise((resolve) => {
      const server = net.createServer({ reuseAddress: true });
      server.once("error", () => resolve(false));
      server.once("listening", () => server.close(() => resolve(true)));
      server.listen(port);
    });

  while (!(isAvailable(port))) {
    console.log(`Port ${port} is in use, trying port ${++port}...`);
  }
  return port;
}

function createFile(filePath, data) {
  if (!existsSync(filePath)) {
    try {
      writeFileSync(filePath, data);
      console.log(relative(root, filePath), "created and data written successfully.");
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

try {
  parse_config_file();
  SET("TYPE", "build");

  let port = getAvailablePort(GET("PORT"));
  console.log("available port", port);

  ["./docker/app", "./docker/nginx"].map((subDir) => {
    mkdirSync(join(root, subDir), { recursive: true }, (err) => {
      if (err) {
        console.error("Error:", err);
      } else {
        console.log("build directory created successfully or already exists.");
      }
    });
  });

  createFile(join(root, "./docker/nginx/nginx.conf"), nginx(port));
  createFile(join(root, "./docker/Dockerfile"), dockerfile(port));
  createFile(join(root, "./docker/docker-compose.yml"), dockerCompose(port));
  createFile(join(root, "./docker/Makefile"), makefile(port));
  copyFileSync(join(root, "./index.html"), join(root, "./docker/app/index.html"));
  copyDir(join(root, "./out"), join(root, "./docker/app"))

  SET("TYPE", "dev");
} catch (error) {
  logerror("Error", error)
}
