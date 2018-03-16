const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const multimediaSchema = new Schema({
  name: { type: String },
  source: { type: String },
  value: { type: String }
});

module.exports = multimediaSchema;
