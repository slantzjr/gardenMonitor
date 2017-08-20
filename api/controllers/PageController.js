/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  showHomePage: function(req, res) {
    console.log('loading homepage');
    if (!req.session.userId) {
      return res.view('homepage', {
        me: {},
      });
    }
    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        res.negotiate(err);
      }
      if (!user) {
        sails.log.verbose('Session refers to a user that cannot be found.');
        return res.view('homepage', {
            me: {},
        });
      }
      return res.view('homepage', {
        me: {
          id: user.id,
          name: user.username,
        },
        });
    });
  },

  showSignupPage: function(req, res) {
    if (req.session.userId) {
      return res.redirect('/');
    }
    return res.view('signup', {
      me: {}
    });
  },

  showMeasurementsPage: function(req, res) {
    if (!req.session.userId) {
      return res.redirect('/');
    }
    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        res.negotiate(err);
      }
      if (!user) {
        return res.redirect('/');
      }
      return res.view('measurementHistory', {
        me: {
          id: req.session.userId,
          email: user.email,
          admin: user.admin
        },
      });
    });
  },
};
