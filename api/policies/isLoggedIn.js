module.exports = function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  if (req.wantsJSON) {
    return res.forbidden('You must be logged in to perform that action.');
  }
  return res.redirect('/');
}