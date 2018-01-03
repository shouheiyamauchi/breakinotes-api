const mongoose = require('mongoose');
const Move = require('./moveModel');
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
          Move.findById(move.startingPosition, (err, move) => {
            if (err) return res.status(500).send(err);
            moveObject['startingPosition'] = move;
            callback(null, move);
          });
        },
        function(callback) {
          queryByArrayOfIds(move.endingPositions).exec((err, moves) => {
            if (err) return res.status(500).send(err);
            moveObject['endingPositions'] = moves;
            callback(null, moves);
          });
        },
        function(callback) {
          Move.findById(move.parentMove, (err, move) => {
            if (err) return res.status(500).send(err);
            moveObject['parentMove'] = move;
            callback(null, move);
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
  }
};

setMoveFields = (req, move) => {
  move.name = req.body.name;
  move.origin = req.body.origin;
  move.type = req.body.type;
  move.notes = req.body.notes;
  move.startingPosition = (req.body.startingPosition === '') ? undefined : req.body.startingPosition;
  move.endingPositions = convertObjectIdArray(req, 'endingPositions');
  move.parentMove = (req.body.parentMove === '') ? undefined : req.body.parentMove;
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

  const singleValueFields = ['name', 'origin', 'type', 'startingPosition', 'parentMove'];
  const arrayValueFields = ['endingPositions'];

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

queryByArrayOfIds = (ids) => {
  return Move.where('_id').in(ids);
};
