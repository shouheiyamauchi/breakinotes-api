require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 3000;

const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(process.env.DB_URL, (err, dbConnection) => {
  if (err) {
    return console.log(err);
  } else {
    const database = dbConnection.db(process.env.DB_NAME);

    require('./app/routes')(app, database);

    app.listen(port, () => {
      console.log('Express server listening on port ' + port);
    });
  };
});
