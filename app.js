const express = require('express');
const app = express();
const db = require('./db');

const MoveController = require('./move/moveController');
app.use('/moves', MoveController);

module.exports = app;
