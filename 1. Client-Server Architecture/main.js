// Import the built-in 'http' module to create an HTTP server
const http = require('http'); 

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/') { // Check if the request URL is the root path
        res.end('Welcome to the Home Page!'); // Send a response for the home page
    } else if (req.url === '/about') { // Check if the request URL is the about page
        res.end('This is the About Page!'); // Send a response for the about page
    } else { // For any other URL
        res.statusCode = 404; // Set the status code to 404 (Not Found)
        res.end('Page Not Found'); // Send a response for the not found page
    }
}
);

// Start the server and listen on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000'); // Log a message when the server starts
});

