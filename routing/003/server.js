const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to serve static files in public directory
// app.use(express.static(path.join(__dirname, 'public')));

// Route handler
app.get('*', (req, res) => {
  // Check if URL ends with "/"
  if (req.path.endsWith('/')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    // Check if the requested file exists
    const requestedFile = path.join(__dirname, req.path);
    fs.access(requestedFile, fs.constants.F_OK, (err) => {
      if (err) {
        // File doesn't exist, so respond with a 404
        // res.status(404).send('404 Not Found');
        res.sendFile(path.join(__dirname, 'index.html'));
      } else {
        // File exists, so serve it
        res.sendFile(requestedFile);
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
