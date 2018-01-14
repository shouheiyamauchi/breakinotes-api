const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');
const moveRoutes = require('./move/moveRoutes');
const s3Routes = require('./s3/s3Routes');

const app = express();
app.use(cors());
app.use(helmet());
app.use('/moves', moveRoutes);
app.use('/s3', s3Routes);

module.exports = app;
