/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Emailaddresses = require('machinepack-emailaddresses');
var Passwords = require('machinepack-passwords');

module.exports = {

  signup: function(req, res) {

    if (_.isUndefined(req.param('email'))) {
      return res.badRequest('An email address is required!');
    }

    if (_.isUndefined(req.param('password'))) {
      return res.badRequest('A password is required!');
    }

    if (req.param('password').length < 6) {
      return res.badRequest('Password must be at least 6 characters!');
    }

    if (_.isUndefined(req.param('username'))) {
      return res.badRequest('A username is required!');
    }

    // username must be at least 6 characters
    if (req.param('username').length < 6) {
      return res.badRequest('Username must be at least 6 characters!');
    }

    // Username must contain only numbers and letters.
    if (!_.isString(req.param('username')) || req.param('username').match(/[^a-z0-9]/i)) {
      return res.badRequest('Invalid username: must consist of numbers and letters only.');
    }

    Emailaddresses.validate({
      string: req.param('email'),
    }).exec({
      // An unexpected error occurred.
      error: function(err) {
        return res.serverError(err);
      },
      // The provided string is not an email address.
      invalid: function() {
        return res.badRequest('Doesn\'t look like an email address to me!'); 
      },
      // OK.
      success: function() { 
        Passwords.encryptPassword({
          password: req.param('password'), 
        }).exec({

          error: function(err) {
            return res.serverError(err); 
          },

          success: function(result) {
            var options = {};

            options.email = req.param('email');
            options.username = req.param('username');
            options.encryptedPassword = result;
            options.admin = false;

            User.create(options).exec(function(err, createdUser) {
              if (err) {

                if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {

                  // return res.send(409, 'Email address is already taken by another user, please try again.');
                  return res.alreadyInUse(err);
                }

                if (err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] && err.invalidAttributes.username[0].rule === 'unique') {

                  // return res.send(409, 'Username is already taken by another user, please try again.');
                  return res.alreadyInUse(err);
                }

                return res.negotiate(err);
              }
              req.session.userId = createdUser.id;
              return res.json(createdUser);
            });
          }
        });
      }
    });
  },

  profile: function(req, res) {

    // Try to look up user using the provided email address
    User.findOne(req.session.userId).exec(function foundUser(err, user) {
      // Handle error
      if (err) return res.negotiate(err); 

      // Handle no user being found
      if (!user) return res.notFound(); 

      // Return the user
      return res.json(user); 
    });
  },

  changePassword: function(req, res) {

    if (_.isUndefined(req.param('password'))) { 
      return res.badRequest('A password is required!');
    }

    if (req.param('password').length < 6) { 
      return res.badRequest('Password must be at least 6 characters!');
    }

    Passwords.encryptPassword({ 
      password: req.param('password'),
    }).exec({
      error: function(err) {
        return res.serverError(err); 
      },
      success: function(result) {

        User.update({ 
          id: req.session.userId,
        }, {
          encryptedPassword: result
        }).exec(function(err, updatedUser) {
          if (err) {
            return res.negotiate(err);
          }
          return res.json(updatedUser); 
        });
      }
    });
  },

  adminUsers: function(req, res) {

    User.find().exec(function(err, users){    

      if (err) return res.negotiate(err);   

      return res.json(users);     

    });
  },

  updateAdmin: function(req, res) {

    User.update(req.param('id'), {    
      admin: req.param('admin')   
    }).exec(function(err, update){

     if (err) return res.negotiate(err);  

      return res.ok();       
    });
  },

  login: function(req, res) {
    User.findOne({email: req.param('email')}, function(err, foundUser) {
      if (err) {
        return res.negotiate(err);
      }
      if (!foundUser) {
        return res.notFound();
      }
      Passwords.checkPassword({ 
        passwordAttempt: req.param('password'),
        encryptedPassword: foundUser.encryptedPassword,
      }).exec({
        error: function(err) {
          return res.serverError(err); 
        },
        incorrect: function() {
          if (req.wantsJSON) {
            return res.ok('Invalid credentials');
          }
          return res.notFound();
        },
        success: function() {
          req.session.userId = foundUser.id;
          if (req.wantsJSON) {
            return res.ok('Login successful');
          }
          return res.redirect('/');
        },
      });
    });
  },

  logout: function(req, res) {
    if (!req.session.userId) {
      return res.redirect('/');
    }
    User.findOne({id: req.session.userId}, function(err, foundUser) {
      if (err) {
        return res.negotiate(err);
      }
      if (!foundUser) {
        sails.log.verbose('session does no point to a user');
      }
      req.session.userId = null;
      return res.redirect('/');
    });
  }
};
