const express = require('express');
const app = express();
const db = require('./db');

const moveRoutes = require('./move/moveRoutes');
app.use('/moves', moveRoutes);

module.exports = app;
