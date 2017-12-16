const express = require('express');
const app = express();
const db = require('./db');

const MoveController = require('./move/MoveController');
app.use('/moves', MoveController);

module.exports = app;
