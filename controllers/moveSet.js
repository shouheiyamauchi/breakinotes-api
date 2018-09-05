const mongoose = require('mongoose');
const MoveSet = require('../models/MoveSet');
const { forceTouchMove } = require('./move');
const { forceTouchMoveFrame } = require('./moveFrame');

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
    MoveSet.find()
    .populate('moves.item')
    .exec((err, moveSets) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moveSets);
    });
  },
  filter: (req, res) => {
    filterMoveSetsQuery(req)
    .populate('moves.item')
    .sort([['draft', -1], ['name', 1]])
    .exec((err, moveSets) => {
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
  },
  forceTouchMoveSet: async (moveSet, cb = () => {}) => {
    await moveSet.populate('moves.item', () => {
      moveSet.moves.forEach((move) => {
        switch(move.moveType) {
          case 'Move':
            forceTouchMove(move.item);
            break;
          case 'MoveFrame':
            forceTouchMoveFrame(move.item);
            break;
        };
      });
    });
  }
};

const setMoveSetFields = (req, moveSet) => {
  moveSet.name = req.body.name;
  moveSet.moves = !req.body.moves ? [] : JSON.parse(req.body.moves);
  moveSet.notes = req.body.notes;
  moveSet.multimedia = !req.body.multimedia ? [] : JSON.parse(req.body.multimedia);
  moveSet.draft = req.body.draft;
};

const filterMoveSetsQuery = req => {
  let moveSetQuery = MoveSet.find();

  if (req.body.name) moveSetQuery = moveSetQuery.where('name').equals(req.body.name);

  if (req.body.moves) {
    const movesQueryArray = JSON.parse(req.body.moves).map(move => { return { 'moves.moveType': move.moveType, 'moves.item': move.item }});

    moveSetQuery = req.body.movesAndOr === 'and'  ? moveSetQuery.and(movesQueryArray) : moveSetQuery.or(movesQueryArray);
  };

  return moveSetQuery;
};
