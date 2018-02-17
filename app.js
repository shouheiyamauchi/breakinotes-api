const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');
const moveRoutes = require('./move/moveRoutes');
const moveFrameRoutes = require('./moveFrame/moveFrameRoutes');
const s3Routes = require('./s3/s3Routes');
const userRoutes = require('./user/userRoutes');

const app = express();
app.use(cors());
app.use(helmet());
app.use('/moves', moveRoutes);
app.use('/moveFrames', moveFrameRoutes);
app.use('/s3', s3Routes);
app.use('/users', userRoutes);

module.exports = app;
