const express = require('express');
const cors = require('cors');
const db = require('./db');
const moveRoutes = require('./move/moveRoutes');

const app = express();
app.use(cors());
app.use('/moves', moveRoutes);

module.exports = app;
