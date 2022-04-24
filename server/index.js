const express = require('express');
const app = express();
const PORT = 3000;

// Parse incoming JSON payloads
app.use(express.json())

// Require router object
const router = require('./routes')

// Use router for all incoming requests
app.use('/', router);

app.listen(PORT, () => console.log(`Listening on port...${PORT}`))