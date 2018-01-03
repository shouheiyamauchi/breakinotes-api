const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const multimediaSchema = new Schema({
  name: { type: String },
  media_type: { type: String },
  url: { type: String }
});

const moveSchema = new Schema({
  name: { type: String, required: true, index: true },
  origin: { type: String, required: true, index: true },
  type: { type: String, required: true, index: true },
  notes: { type: String },
  startingPosition: { type: Schema.Types.ObjectId, ref: 'Move', index: true },
  endingPositions: { type: [Schema.Types.ObjectId], ref: 'Move', default: [], index: true },
  parentMove: { type: Schema.Types.ObjectId, ref: 'Move' },
  multimedia: { type: [multimediaSchema], default: [] },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}, {
  usePushEach: true
});

mongoose.model('Move', moveSchema);

module.exports = mongoose.model('Move');
