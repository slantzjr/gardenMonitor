module.exports = function isAdmin(req, res, next) {
  User.findOne(req.session.userId, function(err, user) {
    if (err) {
      res.negotiate(err);
    }
    if (!user) {
      return res.forbidden('You must be an admin user to perform that action');
    }
    if (user.admin) {
      return next();
    }
    if (req.wantsJSON) {
      return res.forbidden('You must be and admin to perform that action.');
    }
    return res.redirect('/');
  });
}