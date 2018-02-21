const mongoose = require('mongoose');
const Move = require('./moveModel');
const MoveFrame = require('../moveFrame/moveFrameModel');
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
    filterMovesQuery(req).exec((err, moves) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moves);
    });
  },
  get: (req, res) => {
    Move.findById(req.params.id, (err, move) => {
      if (err) return res.status(500).send(err);
      if (!move) return res.status(404).send(err);

      const moveObject = move.toObject();

      async.parallel([
        function(callback) {
          moveFramesByArrayOfIds('_id', move.startingPositions).exec((err, moveFrames) => {
            if (err) return res.status(500).send(err);
            moveObject['startingPositions'] = moveFrames;
            callback(null, moveFrames);
          });
        },
        function(callback) {
          moveFramesByArrayOfIds('_id', move.endingPositions).exec((err, moveFrames) => {
            if (err) return res.status(500).send(err);
            moveObject['endingPositions'] = moveFrames;
            callback(null, moveFrames);
          });
        },
        function(callback) {
          Move.findById(move.parent, (err, move) => {
            if (err) return res.status(500).send(err);
            moveObject['parent'] = move;
            callback(null, move);
          });
        },
        function(callback) {
          movesByArrayOfIds('parent', [move._id]).exec((err, moves) => {
            if (err) return res.status(500).send(err);
            moveObject['childMoves'] = moves;
            callback(null, moves);
          });
        }
      ],
      function(err, results) {
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
  }
};

setMoveFields = (req, move) => {
  move.name = req.body.name;
  move.origin = req.body.origin;
  move.type = req.body.type;
  move.notes = req.body.notes;
  move.startingPositions = convertObjectIdArray(req, 'startingPositions');
  move.endingPositions = convertObjectIdArray(req, 'endingPositions');
  move.parent = (req.body.parent === '') ? undefined : req.body.parent;
  move.multimedia = (req.body.multimedia === undefined || req.body.multimedia === '') ? [] : JSON.parse(req.body.multimedia);
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

filterMovesQuery = (req) => {
  let moveQuery = Move.find();

  const singleValueFields = ['name', 'origin', 'type', 'parent'];
  const arrayValueFields = ['startingPositions', 'endingPositions'];

  singleValueFields.forEach((fieldName) => {
    if (req.body[fieldName]) {
      moveQuery = moveQuery.where(fieldName).equals(req.body[fieldName]);
    };
  });

  arrayValueFields.forEach((fieldName) => {
    if (req.body[fieldName]) {
      const idObjectArray = [];

      JSON.parse(req.body[fieldName]).forEach((idString) => {
        const idObject = {};
        idObject[fieldName] = idString;
        idObjectArray.push(idObject);
      });
      // queries for documents which contain all items in array
      moveQuery = moveQuery.and(idObjectArray);
    };
  });

  return moveQuery;
};

getSuggestions = (req, res, startingOrEndingPositionsString, callback) => {
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

moveFramesByArrayOfIds = (moveFrameProperty, idsArray) => {
  return MoveFrame.where(moveFrameProperty).in(idsArray);
};

movesByArrayOfIds = (moveProperty, idsArray) => {
  return Move.where(moveProperty).in(idsArray);
};
