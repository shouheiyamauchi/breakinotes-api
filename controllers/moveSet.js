const mongoose = require('mongoose');
const MoveSet = require('../models/MoveSet');

module.exports = {
  create: (req, res) => {
    const moveSet = new MoveSet();
    setMoveSetFields(req, moveSet);

    moveSet.save((err, moveSet) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moveSet);
    })
  },
  list: (req, res) => {
    MoveSet.find({}, (err, moveSets) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moveSets);
    });
  },
  filter: (req, res) => {
    filterMoveSetsQuery(req).exec((err, moveSets) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moveSets);
    })
  },
  get: (req, res) => {
    MoveSet.findById(req.params.id)
    .populate('moves.item')
    .exec((err, moveSet) => {
      if (err) return res.status(500).send(err);
      if (!moveSet) return res.status(404).send(err);
      res.status(200).send(moveSet);
    });
  },
  update: (req, res) => {
    MoveSet.findById(req.params.id, (err, moveSet) => {
      if (err) return res.status(500).send(err);
      if (!moveSet) return res.status(404).send(err);
      setMoveSetFields(req, moveSet);
      moveSet.updated = Date.now();

      moveSet.save((err, moveSet) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(moveSet);
      });
    });
  },
  delete: (req, res) => {
    MoveSet.findByIdAndRemove(req.params.id, (err, moveSet) => {
      if (err) return res.status(500).send(err);
      if (!moveSet) return res.status(404).send('No move set item found.');
      res.status(200).send('Move set was deleted.');
    });
  }
};

setMoveSetFields = (req, moveSet) => {
  moveSet.name = req.body.name;
  moveSet.moves = !req.body.moves ? [] : JSON.parse(req.body.moves);
  moveSet.notes = req.body.notes;
  moveSet.multimedia = !req.body.multimedia ? [] : JSON.parse(req.body.multimedia);
};

filterMoveSetsQuery = req => {
  let moveSetQuery = MoveSet.find();

  // filter by name and moves

  return moveSetQuery;
};
