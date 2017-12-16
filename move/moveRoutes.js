const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: true }));
const Move = require('./moveModel');

router.post('/', postFunction);

function postFunction(req, res) {
  const move = new Move();
  move.name = req.body.name;
  move.creationCategory = req.body.creationCategory;
  move.moveCategory = req.body.moveCategory;
  move.notes = req.body.notes;
  move.startingPosition = req.body.startingPosition;
  move.endingPositions = convertObjectIdArray(req, 'endingPositions');
  move.parentMove = req.body.parentMove;
  move.childMoves = convertObjectIdArray(req, 'childMoves');

  move.save((err, move) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(move);
  });
}

router.get('/', (req, res) => {
  Move.find({}, (err, moves) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(moves);
  });
});

router.get('/:id', (req, res) => {
  Move.findById(req.params.id, (err, move) => {
    if (err) return res.status(500).send(err);
    if (!move) return res.status(404).send("No move found.");
    res.status(200).send(move);
  });
});

router.put('/:id', (req, res) => {
  Move.findById(req.params.id, (err, move) => {
    if (err) return res.status(500).send(err);
    if (!move) return res.status(404).send("No move found.");
    move.name = req.body.name;
    move.creationCategory = req.body.creationCategory;
    move.moveCategory = req.body.moveCategory;
    move.notes = req.body.notes;
    move.startingPosition = req.body.startingPosition;
    move.endingPositions = convertObjectIdArray(req, 'endingPositions');
    move.parentMove = req.body.parentMove;
    move.childMoves = convertObjectIdArray(req, 'childMoves');
    move.updated = Date.now();

    move.save((err, move) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(move);
    });
  });
});

router.delete('/:id', (req, res) => {
  Move.findByIdAndRemove(req.params.id, (err, move) => {
    if (err) return res.status(500).send(err);
    if (!move) return res.status(404).send("No move found.");
    res.status(200).send(move.name + " was deleted.");
  });
});

const convertObjectIdArray = (req, fieldName) => {
  const objectIdArray = []

  if (req.body[fieldName]) {
    JSON.parse(req.body[fieldName]).forEach((idString) => {
      objectIdArray.push(mongoose.Types.ObjectId(idString));
    });
  };

  return objectIdArray
};

module.exports = router;
