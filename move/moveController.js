const mongoose = require('mongoose');
const Move = require('./moveModel');

module.exports = {
  create: (req, res) => {
    const move = new Move();
    setMoveFields(req, move);

    move.save((err, move) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(move);
    });
  },
  list: (req, res) => {
    Move.find({}, (err, moves) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moves);
    });
  },
  get: (req, res) => {
    Move.findById(req.params.id, (err, move) => {
      if (err) return res.status(500).send(err);
      if (!move) return res.status(404).send("No move found.");
      res.status(200).send(move);
    });
  },
  update: (req, res) => {
    Move.findById(req.params.id, (err, move) => {
      if (err) return res.status(500).send(err);
      if (!move) return res.status(404).send("No move found.");
      setMoveFields(req, move);
      move.updated = Date.now();

      move.save((err, move) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(move);
      });
    });
  },
  delete: (req, res) => {
    Move.findByIdAndRemove(req.params.id, (err, move) => {
      if (err) return res.status(500).send(err);
      if (!move) return res.status(404).send("No move found.");
      res.status(200).send(move.name + " was deleted.");
    });
  }
};

setMoveFields = (req, move) => {
  move.name = req.body.name;
  move.creationCategory = req.body.creationCategory;
  move.moveCategory = req.body.moveCategory;
  move.notes = req.body.notes;
  move.startingPosition = req.body.startingPosition;
  move.endingPositions = convertObjectIdArray(req, 'endingPositions');
  move.parentMove = req.body.parentMove;
  move.childMoves = convertObjectIdArray(req, 'childMoves');
  move.multimedia = (req.body.multimedia == undefined) ? [] : JSON.parse(req.body.multimedia);
};

convertObjectIdArray = (req, fieldName) => {
  const objectIdArray = []

  if (req.body[fieldName]) {
    JSON.parse(req.body[fieldName]).forEach((idString) => {
      objectIdArray.push(mongoose.Types.ObjectId(idString));
    });
  };

  return objectIdArray
};
