const mongoose = require('mongoose');
const multimediaSchema = require('./multimediaSchema');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const practiceItemSchema = new Schema({
  date: { type: Date, required: true, index: true },
  move: {
    moveType: String,
    item: { type: Schema.Types.ObjectId, refPath: 'move.moveType' },
  },
  notes: { type: String },
  multimedia: { type: [multimediaSchema], default: [] },
  completed: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}, {
  usePushEach: true
});

mongoose.model('PracticeItem', practiceItemSchema);

module.exports = mongoose.model('PracticeItem');
