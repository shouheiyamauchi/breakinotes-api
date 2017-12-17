const express = require('express');
const db = require('./db');
const moveRoutes = require('./move/moveRoutes');

const app = express();
app.use('/moves', moveRoutes);

module.exports = app;
