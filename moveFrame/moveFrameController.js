const mongoose = require('mongoose');
const MoveFrame = require('./moveFrameModel');
const Move = require('../move/moveModel');
const async = require('async');

module.exports = {
  create: (req, res) => {
    const moveFrame = new MoveFrame();
    setMoveFrameFields(req, moveFrame);

    moveFrame.save((err, moveFrame) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moveFrame);
    });
  },
  list: (req, res) => {
    MoveFrame.find({}, (err, moveFrames) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moveFrames);
    });
  },
  filter: (req, res) => {
    filterMoveFramesQuery(req).exec((err, moveFrames) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(moveFrames);
    });
  },
  get: (req, res) => {
    MoveFrame.findById(req.params.id, (err, moveFrame) => {
      if (err) return res.status(500).send(err);
      if (!moveFrame) return res.status(404).send(err);

      const moveFrameObject = moveFrame.toObject();

      async.parallel([
        function(callback) {
          movesByArrayOfIds('endingPositions', [moveFrame._id]).exec((err, moves) => {
            if (err) return res.status(500).send(err);
            moveFrameObject['entries'] = moves;
            callback(null, moves);
          });
        },
        function(callback) {
          movesByArrayOfIds('startingPositions', [moveFrame._id]).exec((err, moves) => {
            if (err) return res.status(500).send(err);
            moveFrameObject['exits'] = moves;
            callback(null, moves);
          });
        },
        function(callback) {
          MoveFrame.findById(moveFrame.parentMove, (err, moveFrame) => {
            if (err) return res.status(500).send(err);
            moveFrameObject['parentMove'] = moveFrame;
            callback(null, moveFrame);
          });
        },
        function(callback) {
          moveFramesByArrayOfIds('parentMove', [moveFrame._id]).exec((err, moveFrames) => {
            if (err) return res.status(500).send(err);
            moveFrameObject['childMoves'] = moveFrames;
            callback(null, moveFrames);
          });
        }
      ],
      function(err, results) {
        res.status(200).send(moveFrameObject);
      });
    });
  },
  update: (req, res) => {
    MoveFrame.findById(req.params.id, (err, moveFrame) => {
      if (err) return res.status(500).send(err);
      if (!moveFrame) return res.status(404).send(err);
      setMoveFrameFields(req, moveFrame);
      moveFrame.updated = Date.now();

      moveFrame.save((err, moveFrame) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(moveFrame);
      });
    });
  },
  delete: (req, res) => {
    MoveFrame.findByIdAndRemove(req.params.id, (err, moveFrame) => {
      if (err) return res.status(500).send(err);
      if (!moveFrame) return res.status(404).send('No move frame found.');
      res.status(200).send(moveFrame.name + ' was deleted.');
    });
  }
};

setMoveFrameFields = (req, moveFrame) => {
  moveFrame.name = req.body.name;
  moveFrame.origin = req.body.origin;
  moveFrame.type = req.body.type;
  moveFrame.notes = req.body.notes;
  moveFrame.parentMove = (req.body.parentMove === '') ? undefined : req.body.parentMove;
  moveFrame.multimedia = (req.body.multimedia === undefined || req.body.multimedia === '') ? [] : JSON.parse(req.body.multimedia);
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

filterMoveFramesQuery = (req) => {
  let moveFrameQuery = MoveFrame.find();

  const singleValueFields = ['name', 'origin', 'type', 'parentMove'];

  singleValueFields.forEach((fieldName) => {
    if (req.body[fieldName]) {
      moveFrameQuery = moveFrameQuery.where(fieldName).equals(req.body[fieldName]);
    };
  });

  return moveFrameQuery;
};

moveFramesByArrayOfIds = (moveFrameProperty, idsArray) => {
  return MoveFrame.where(moveFrameProperty).in(idsArray);
};

movesByArrayOfIds = (moveProperty, idsArray) => {
  return Move.where(moveProperty).in(idsArray);
};
