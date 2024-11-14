import http from 'http';
import fs from 'fs';
import { JSDOM } from 'jsdom';

// Read the HTML template and JavaScript files
const htmlContent = fs.readFileSync('index.html', 'utf8');
const jsScript = fs.readFileSync('index.js', 'utf8');

// Function to generate the final HTML with JavaScript execution
function generateRenderedContent() {
  // Create a JSDOM instance with the HTML content
  const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable" });
  const { window } = dom;
  const { document } = window;

  // Evaluate the JavaScript code in the context of the JSDOM window
  dom.window.eval(jsScript);

  // Wait for JavaScript to complete execution
  return new Promise((resolve) => {
    // Delay to ensure script has executed
    setTimeout(() => resolve(dom.serialize()), 100); 
  });
}

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    // Generate the rendered HTML
    const renderedContent = await generateRenderedContent();

    // Serve the HTML
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(renderedContent);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
