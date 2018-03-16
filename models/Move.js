const mongoose = require('mongoose');
const multimediaSchema = require('./multimediaSchema');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const moveSchema = new Schema({
  name: { type: String, required: true, index: true },
  origin: { type: String, required: true, index: true },
  type: { type: String, required: true, index: true },
  notes: { type: String },
  startingPositions: { type: [Schema.Types.ObjectId], ref: 'Move', default: [], index: true },
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
