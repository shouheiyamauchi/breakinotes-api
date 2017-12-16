const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moveSchema = new Schema({
  name: { type: String, index: true },
  creationCategory: { type: String, index: true },
  moveCategory: { type: String, index: true },
  notes: String,
  startingPositions: [
    { type: Schema.Types.ObjectId, index: true }
  ],
  endingPositions: [
    { type: Schema.Types.ObjectId, index: true }
  ],
  parentMove: Schema.Types.ObjectId,
  childMoves: [
    Schema.Types.ObjectId
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
