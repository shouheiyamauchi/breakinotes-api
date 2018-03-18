const mongoose = require('mongoose');
const multimediaSchema = require('./multimediaSchema');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const setSchema = new Schema({
  name: { type: String, required: true, index: true },
  moves: [{
    moveType: String,
    item: { type: Schema.Types.ObjectId, refPath: 'moves.moveType' }
  }],
  notes: { type: String },
  multimedia: { type: [multimediaSchema], default: [] },
  draft: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}, {
  usePushEach: true
});

mongoose.model('Set', setSchema);

module.exports = mongoose.model('Set');
