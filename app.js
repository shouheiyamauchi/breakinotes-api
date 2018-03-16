const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');
const moveRoutes = require('./routes/move');
const moveFrameRoutes = require('./routes/moveFrame');
const s3Routes = require('./routes/s3');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(helmet());
app.use('/moves', moveRoutes);
app.use('/moveFrames', moveFrameRoutes);
app.use('/s3', s3Routes);
app.use('/users', userRoutes);

module.exports = app;
