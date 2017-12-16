const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const moveSchema = new Schema({
  name: { type: String, index: true },
  creationCategory: { type: String, index: true },
  moveCategory: { type: String, index: true },
  notes: String,
  startingPosition: { type: Schema.Types.ObjectId, ref: 'Move', index: true },
  endingPositions: [
    { type: Schema.Types.ObjectId, ref: 'Move', index: true }
  ],
  parentMove: { type: Schema.Types.ObjectId, ref: 'Move' },
  childMoves: [
    { type: Schema.Types.ObjectId, ref: 'Move' }
  ],
  multimedia: [
    {
      name: String,
      media_type: String,
      url: String
    }
  ],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

mongoose.model('Move', moveSchema);

module.exports = mongoose.model('Move');
