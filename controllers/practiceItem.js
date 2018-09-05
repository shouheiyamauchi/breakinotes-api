const mongoose = require('mongoose');
const moment = require('moment');
const PracticeItem = require('../models/PracticeItem');
const { forceTouchMove } = require('./move');
const { forceTouchMoveFrame } = require('./moveFrame');
const { forceTouchMoveSet } = require('./moveSet');

module.exports = {
  create: (req, res) => {
    const practiceItem = new PracticeItem();
    setPracticeItemFields(req, practiceItem);

    practiceItem.save((err, practiceItem) => {
      if (err) return res.status(500).send(err);
      practiceItem.populate('move.item', () => {
        res.status(200).send(practiceItem);
      });
    });
  },
  list: (req, res) => {
    PracticeItem.find()
    .populate('move.item')
    .exec((err, practiceItems) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(practiceItems);
    });
  },
  filter: (req, res) => {
    filterPracticeItemsQuery(req)
    .populate('move.item')
    .exec((err, practiceItems) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(practiceItems);
    })
  },
  get: (req, res) => {
    PracticeItem.findById(req.params.id)
    .populate('move.item')
    .exec((err, practiceItem) => {
      if (err) return res.status(500).send(err);
      if (!practiceItem) return res.status(404).send(err);
      res.status(200).send(practiceItem);
    });
  },
  update: (req, res) => {
    PracticeItem.findById(req.params.id, (err, practiceItem) => {
      if (err) return res.status(500).send(err);
      if (!practiceItem) return res.status(404).send(err);
      setPracticeItemFields(req, practiceItem);
      practiceItem.updated = Date.now();

      practiceItem.save((err, practiceItem) => {
        if (err) return res.status(500).send(err);
        practiceItem.populate('move.item', () => {
          res.status(200).send(practiceItem);
        });
      });
    });
  },
  delete: (req, res) => {
    PracticeItem.findByIdAndRemove(req.params.id, (err, practiceItem) => {
      if (err) return res.status(500).send(err);
      if (!practiceItem) return res.status(404).send('No practice item found.');
      res.status(200).send('Practice item was deleted.');
    });
  },
  toggle: (req, res) => {
    PracticeItem.findById(req.body.id, (err, practiceItem) => {
      if (err) return res.status(500).send(err);
      if (!practiceItem) return res.status(404).send(err);
      practiceItem.completed = !practiceItem.completed;
      practiceItem.updated = Date.now();

      practiceItem.save((err, practiceItem) => {
        if (err) return res.status(500).send(err);
        practiceItem.populate('move.item', () => {

          switch(practiceItem.move.moveType) {
            case 'Move':
              forceTouchMove(practiceItem.move.item);
              break;
            case 'MoveFrame':
              forceTouchMoveFrame(practiceItem.move.item);
              break;
            case 'MoveSet':
              forceTouchMoveSet(practiceItem.move.item);
              break;
          };

          res.status(200).send(practiceItem);
        });
      });
    });
  }
};

const setPracticeItemFields = (req, practiceItem) => {
  practiceItem.date = moment.utc(req.body.date, 'DD/MM/YYYY').format();
  practiceItem.move = JSON.parse(req.body.move);
  practiceItem.notes = req.body.notes;
  practiceItem.multimedia = !req.body.multimedia ? [] : JSON.parse(req.body.multimedia);
  practiceItem.completed = req.body.completed;
};

const filterPracticeItemsQuery = req => {
  let practiceItemQuery = PracticeItem.find();

  if (req.body.startDate && req.body.endDate) practiceItemQuery = practiceItemQuery.where('date').in(getDatesArray(req.body.startDate, req.body.endDate));
  if (req.body.move) practiceItemQuery = practiceItemQuery.find({ 'move.moveType': JSON.parse(req.body.move).moveType, 'move.item': JSON.parse(req.body.move).item }).sort([['date', -1]]).limit(JSON.parse(req.body.move).limit);

  return practiceItemQuery;
};

const getDatesArray = (startDate, endDate) => {
  const dateArray = [];
  let currentDate = moment.utc(startDate, 'DD/MM/YYYY');
  const dateLimit = moment.utc(endDate, 'DD/MM/YYYY');
  while (currentDate <= dateLimit) {
      dateArray.push(moment(currentDate).format());
      currentDate = moment(currentDate).add(1, 'days');
  };

  return dateArray;
};
