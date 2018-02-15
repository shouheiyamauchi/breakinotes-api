const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  login: (req, res) => {
    User.findOne({'username': req.body.username}).exec((err, user) => {
      if (err) return;

      const correctPassword = bcrypt.compareSync(req.body.password, user.password);

      if (correctPassword) {
        const payload = {id: user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.json({message: "login successful", token: token});
      } else {
        res.json({message: "login unsuccessful"});
      };
    });
  }
};
