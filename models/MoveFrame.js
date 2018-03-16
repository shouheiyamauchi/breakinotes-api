const mongoose = require('mongoose');
const multimediaSchema = require('./multimediaSchema');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const moveFrameSchema = new Schema({
  name: { type: String, required: true, index: true },
  origin: { type: String, required: true, index: true },
  type: { type: String, required: true, index: true },
  notes: { type: String },
  parent: { type: Schema.Types.ObjectId, ref: 'MoveFrame' },
  multimedia: { type: [multimediaSchema], default: [] },
  draft: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}, {
  usePushEach: true
});

mongoose.model('MoveFrame', moveFrameSchema);

module.exports = mongoose.model('MoveFrame');
