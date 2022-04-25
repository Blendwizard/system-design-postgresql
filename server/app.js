const express = require('express');
const app = express();

// Parse incoming JSON payloads
app.use(express.json())

// Require router object
const router = require('./routes')

// Use router for all incoming requests
app.use('/', router);

module.exports = app;