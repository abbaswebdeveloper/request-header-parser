const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Request Header Parser Microservice',
    endpoint: 'GET /api/whoami',
    returns: {
      ipaddress: 'Your IP address',
      language: 'Your preferred language', 
      software: 'Your browser/software info'
    }
  });
});

// Main API endpoint
app.get('/api/whoami', (req, res) => {
  try {
    // Get IP address (handles proxy scenarios)
    const ipaddress = req.ip || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null);

    // Get language from Accept-Language header
    const language = req.headers['accept-language'] || 'Unknown';

    // Get software from User-Agent header
    const software = req.headers['user-agent'] || 'Unknown';

    // Clean IP address (remove IPv6 prefix if present)
    const cleanIP = ipaddress ? ipaddress.replace(/^::ffff:/, '') : 'Unknown';

    // Return JSON response
    res.json({
      ipaddress: cleanIP,
      language: language.split(',')[0], // Get first language preference
      software: software
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Server configuration
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Request Header Parser running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;