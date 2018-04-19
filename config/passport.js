const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // match user
    User.findOne({email: email}).then(user => {
      if (!user) {
        return done(null,false,{message: 'No user found'});
      }
      
      // match password
      // here password is the input password entered on the login form
      // user.password is the encrypted password stored in the db
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          // first param: error
          // second param: user
          // third param: message
          return done(null,user)
        } else {
         return done(null,false,{message: 'Password incorrect'});
        }
      })
    });
  }));
  
  passport.serializeUser(function(user,done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id,done) {
    User.findById(id, function(error, user) {
      done(error, user);
    });
  });
};