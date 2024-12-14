const express = require('express');
const path = require('path');
const cors = require('cors'); // Required for CORS if frontend and backend are on different domains/ports
const bodyParser = require('body-parser');

const app = express();

// 1. Middleware for CORS (if needed for cross-origin requests)
app.use(cors());

// 2. Middleware to parse JSON requests
app.use(bodyParser.json());

// 3. Middleware to serve static files from the "public" directory
app.get('/test-static', (req, res) => {
    res.send('Static middleware is working');
  });
  app.use(express.static(path.join(__dirname, 'public')));
  

// 4. Example API route (replace with your own routes)
app.use('/api/auth', require('./routes/authRoutes'));

// 5. Catch-all route to handle undefined routes (optional)
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
