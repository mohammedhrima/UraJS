const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const path = require("path");

// Define the port
const PORT = process.env.PORT || 5000;

const serveStaticFile = (filePath, contentType, res) => {
	fs.readFile(filePath, (err, data) => {
		if (err) {
			console.log("file not found", filePath);
			res.writeHead(404, { "Content-Type": "text/plain" });
			res.end("404 Not Found");
		} else {
			res.writeHead(200, { "Content-Type": contentType });
			res.end(data);
		}
	});
};

const server = http.createServer((req, res) => {
	console.log("send ", req.url);
	if (req.method === "GET" && req.url === "/") 
	{
		const indexPath = path.resolve(__dirname, "index.html");
		serveStaticFile(indexPath, "text/html", res);
	}
	else if (req.method === "GET")
	{
		const filePath = path.resolve(__dirname, "." + req.url);
		const ext = path.extname(filePath);
		let contentType = "text/plain";
		switch (ext) {
			case ".js":
				contentType = "application/javascript";
				break;
			case ".css":
				contentType = "text/css";
				break;
			case ".html":
				contentType = "text/html";
				break;
			case ".svg":
				contentType = "image/svg+xml";
				break
		}
		serveStaticFile(filePath, contentType, res);
	}
	else
	{
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("404 Not Found");
	}
});

let index = 0;
const wss = new WebSocket.Server({ server });
function listenOnChange(filePath) {
	let timeout;
	fs.watch(filePath, (eventType, filename) => {
		if (eventType === 'change') {
			clearTimeout(timeout);
            timeout = setTimeout(() => {
                console.log(index, filePath, 'has been modified.');
                index++;
                // Uncomment to notify clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send('refresh');
                    }
                });
            }, 1); // 1 ms debounce time
		}
	});
}

// Function to recursively watch files in a directory
function watchDirectory(directoryPath) {
	console.log("watch", directoryPath);
	fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
		if (err) {
			console.error('Error reading directory:', err);
			return;
		}
		// console.log(files);

		files.forEach((file) => {
			const fullPath = path.join(directoryPath, file.name);
			if (file.isDirectory()) {
				watchDirectory(fullPath);
			} else {
				listenOnChange(fullPath);
			}
		});
	});
}

watchDirectory(path.resolve(__dirname, 'dist/pages'));
listenOnChange(path.resolve(__dirname, 'index.html'))

wss.on("connection", (ws) => {
	console.log("Client connected");
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
