require('dotenv').config();

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(process.env.DB_URL, (err, dbConnection) => {
  if (err) {
    return console.log(err);
  } else {
    const database = dbConnection.db(process.env.DB_NAME);

    require('./app/routes')(app, database);

    app.listen(port, () => {
      console.log('Server running on port: ' + port);
    });
  };
});
