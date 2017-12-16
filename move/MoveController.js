const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
const Move = require('./Move');

router.post('/', (req, res) => {
  Move.create({
    name: req.body.name,
    creationCategory: req.body.creationCategory,
    moveCategory: req.body.moveCategory,
    notes: req.body.notes
  }, (err, move) => {
    if (err) {
      res.status(500).send("There was a problem adding the move to the database.");
    } else {
      res.status(200).send(move);
    };
  });
});

router.get('/', (req, res) => {
  Move.find({}, (err, moves) => {
    if (err) {
      res.status(500).send("There was a problem finding the moves.");
    } else {
      res.status(200).send(moves);
    };
  });
});

// app.get('/notes/:id', (req, res) => {
//   const id = req.params.id;
//   const details = { '_id': new ObjectID(id) };
//   db.collection('notes').findOne(details, (err, item) => {
//     if (err) {
//       res.send({'error':'An error has occurred'});
//     } else {
//       res.send(item);
//     };
//   });
// });
//
// app.delete('/notes/:id', (req, res) => {
//   const id = req.params.id;
//   const details = { '_id': new ObjectID(id) };
//   db.collection('notes').remove(details, (err, item) => {
//     if (err) {
//       res.send({'error':'An error has occurred'});
//     } else {
//       res.send('Note ' + id + ' deleted');
//     };
//   });
// });
//
// app.put('/notes/:id', (req, res) => {
//   const id = req.params.id;
//   const details = { '_id': new ObjectID(id) };
//   const note  = { 'text': req.body.body, 'title': req.body.title };
//   db.collection('notes').update(details, note, (err, result) => {
//     if (err) {
//       res.send({'error': 'An error has occurred'});
//     } else {
//       res.send(note);
//     };
//   });
// });

module.exports = router;
