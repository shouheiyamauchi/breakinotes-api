const passport = require('passport');
const passportJwt = require('passport-jwt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// set up passport
const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = process.env.JWT_SECRET;

const strategy = new JwtStrategy(jwtOptions, function(jwtPayload, done) {
  User.findById(jwtPayload.id)
    .then(user => {
      done(null, user);
    })
    .catch(errors => {
      done(null, false);
    });
});

passport.use(strategy);

module.exports = passport;
