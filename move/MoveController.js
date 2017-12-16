const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
const Move = require('./Move');

router.post('/', (req, res) => {
  let move = new Move({
    name: req.body.name,
    creationCategory: req.body.creationCategory,
    moveCategory: req.body.moveCategory,
    notes: req.body.notes,
    startingPosition: req.body.startingPosition,
    parentMove: req.body.parentMove
  });

  if (req.body.endingPositions) {
    JSON.parse(req.body.endingPositions).forEach((endingPosition) => {
      move.endingPositions.push(endingPosition);
    });
  };

  if (req.body.childMoves) {
    JSON.parse(req.body.childMoves).forEach((childMove) => {
      move.childMoves.push(childMove);
    });
  };

  move.save((err, move) => {
    if (err) return res.status(500).send("There was a problem adding the move to the database.");
    res.status(200).send(move);
  });
});

router.get('/', (req, res) => {
  Move.find({}, (err, moves) => {
    if (err) return res.status(500).send("There was a problem finding the moves.");
    res.status(200).send(moves);
  });
});

router.get('/:id', (req, res) => {
  Move.findById(req.params.id, (err, move) => {
    if (err) return res.status(500).send("There was a problem finding the move.");
    if (!move) return res.status(404).send("No move found.");
    res.status(200).send(move);
  });
});

router.put('/:id', (req, res) => {
  Move.findById(req.params.id, (err, move) => {
    if (err) return res.status(500).send("There was a problem finding the move.");
    if (!move) return res.status(404).send("No move found.");
    move.name = req.body.name;
    move.creationCategory = req.body.creationCategory;
    move.moveCategory = req.body.moveCategory;
    move.notes = req.body.notes;
    move.startingPosition = req.body.startingPosition;
    move.parentMove = req.body.parentMove;
    move.updated = Date.now();

    if (req.body.endingPositions) {
      JSON.parse(req.body.endingPositions).forEach((endingPosition) => {
        move.endingPositions.push(endingPosition);
      });
    };

    if (req.body.childMoves) {
      JSON.parse(req.body.childMoves).forEach((childMove) => {
        move.childMoves.push(childMove);
      });
    };

    move.save((err, move) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(move);
    });
  });
});

router.delete('/:id', (req, res) => {
  Move.findByIdAndRemove(req.params.id, (err, move) => {
    if (err) return res.status(500).send("There was a problem deleting the move.");
    if (!move) return res.status(404).send("No move found.");
    res.status(200).send(move.name + " was deleted.");
  });
});

module.exports = router;
