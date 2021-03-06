const mongoose = require('mongoose');
const multimediaSchema = require('./multimediaSchema');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const moveSchema = new Schema({
  name: { type: String, required: true, index: true },
  origin: { type: String, required: true, index: true },
  type: { type: String, required: true, index: true },
  notes: { type: String },
  startingPositions: [{ type: Schema.Types.ObjectId, ref: 'MoveFrame', default: [], index: true }],
  endingPositions: [{ type: Schema.Types.ObjectId, ref: 'MoveFrame', default: [], index: true }],
  parent: { type: Schema.Types.ObjectId, ref: 'Move' },
  multimedia: { type: [multimediaSchema], default: [] },
  draft: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  touched: { type: Date, default: Date.now }
}, {
  usePushEach: true
});

mongoose.model('Move', moveSchema);

module.exports = mongoose.model('Move');
