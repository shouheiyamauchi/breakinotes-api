const mongoose = require('mongoose');
const moment = require('moment');
const Move = require('../models/Move');
const MoveFrame = require('../models/MoveFrame');
const async = require('async');

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
  filter: (req, res) => {
    filterMovesQuery(req).sort([['draft', -1], ['type', 1], ['origin', 1], ['name', 1]]).exec((err, moves) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moves);
    });
  },
  get: (req, res) => {
    Move.findById(req.params.id)
    .populate('startingPositions')
    .populate('endingPositions')
    .populate('parent')
    .exec((err, move) => {
      if (err) return res.status(500).send(err);
      if (!move) return res.status(404).send(err);

      movesByArrayOfIds('parent', [move._id]).exec((err, moves) => {
        if (err) return res.status(500).send(err);
        const moveObject = move.toObject();

        moveObject['childMoves'] = moves;

        res.status(200).send(moveObject);
      });
    });
  },
  update: (req, res) => {
    Move.findById(req.params.id, (err, move) => {
      if (err) return res.status(500).send(err);
      if (!move) return res.status(404).send(err);
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
      if (!move) return res.status(404).send('No move found.');
      res.status(200).send(move.name + ' was deleted.');
    });
  },
  suggestions: (req, res) => {
    // suggest potential starting/ending positings based on other moves with same starting/ending positions
    async.parallel({
      startingPositionSuggestions: function(callback) {
        getSuggestions(req, res, 'startingPositions', callback);
      },
      endingPositionSuggestions: function(callback) {
        getSuggestions(req, res, 'endingPositions', callback);
      }
    },
    function(err, results) {
      res.status(200).send({
        startingPositionSuggestions: results.startingPositionSuggestions,
        endingPositionSuggestions: results.endingPositionSuggestions
      });
    });
  },
  touched: (req, res) => {
    Move.find({ touched: { '$lte': moment().subtract(req.body.value, req.body.unit) }}, (err, moves) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moves);
    });
  },
  forceTouch: (req, res) => {
    Move.findById(req.params.id, (err, move) => {
      if (err) return res.status(500).send(err);
      if (!move) return res.status(404).send(err);

      module.exports.forceTouchMove(move, (touchedErr, touchedMove) => {
        if (touchedErr) return res.status(500).send(touchedErr);
        res.status(200).send(touchedMove);
      });
    });
  },
  forceTouchMove: async (move, cb = () => {}) => {
    move.touched = Date.now();

    await move.save((err, touchedMove) => {
      cb(err, touchedMove);
    });
  }
};

const setMoveFields = (req, move) => {
  move.name = req.body.name;
  move.origin = req.body.origin;
  move.type = req.body.type;
  move.notes = req.body.notes;
  move.startingPositions = convertObjectIdArray(req, 'startingPositions');
  move.endingPositions = convertObjectIdArray(req, 'endingPositions');
  move.parent = (req.body.parent === '') ? undefined : req.body.parent;
  move.multimedia = (req.body.multimedia === undefined || req.body.multimedia === '') ? [] : JSON.parse(req.body.multimedia);
  move.draft = req.body.draft;
};

const convertObjectIdArray = (req, fieldName) => {
  const objectIdArray = []

  if (req.body[fieldName]) {
    JSON.parse(req.body[fieldName]).forEach((idString) => {
      objectIdArray.push(mongoose.Types.ObjectId(idString));
    });
  };

  return objectIdArray
};

const filterMovesQuery = (req) => {
  let moveQuery = Move.find();

  const singleValueFields = ['name', 'origin', 'type', 'parent', 'draft'];
  const arrayValueFields = ['startingPositions', 'endingPositions'];

  singleValueFields.forEach((fieldName) => {
    if (req.body[fieldName]) {
      moveQuery = moveQuery.where(fieldName).equals(req.body[fieldName]);
    };
  });

  arrayValueFields.forEach((fieldName) => {
    if (req.body[fieldName]) {
      const idObjectArray = JSON.parse(req.body[fieldName]).map((idString) => { return { [fieldName]: idString }});

      moveQuery = req.body[fieldName + 'AndOr'] === 'and' ? moveQuery.and(idObjectArray) : moveQuery.or(idObjectArray);
    };
  });

  return moveQuery;
};

const getSuggestions = (req, res, startingOrEndingPositionsString, callback) => {
  const startingOrEndingPositionsArray = JSON.parse(req.body[startingOrEndingPositionsString]);

  movesByArrayOfIds(startingOrEndingPositionsString, startingOrEndingPositionsArray).exec((err, moves) => {
    if (err) return res.status(500).send(err);

    let positionSuggestionIdObjects = [];
    moves.forEach(move => {
      positionSuggestionIdObjects = positionSuggestionIdObjects.concat(move[startingOrEndingPositionsString]);
    })

    let positionSuggestionIds = positionSuggestionIdObjects.map(id => id.toString());
    // remove duplicates
    positionSuggestionIds = positionSuggestionIds.filter((positionSuggestionId, index, fullArray) => {
      return fullArray.indexOf(positionSuggestionId) === index && !startingOrEndingPositionsArray.includes(positionSuggestionId);
    });

    moveFramesByArrayOfIds('_id', positionSuggestionIds).exec((err, moveFrames) => {
      if (err) return res.status(500).send(err);

      callback(null, moveFrames);
    });
  });
};

const moveFramesByArrayOfIds = (moveFrameProperty, idsArray) => {
  return MoveFrame.where(moveFrameProperty).in(idsArray);
};

const movesByArrayOfIds = (moveProperty, idsArray) => {
  return Move.where(moveProperty).in(idsArray);
};
