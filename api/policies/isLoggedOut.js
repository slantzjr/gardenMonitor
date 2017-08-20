const isLoggedOut = function(req, res, next) {
  if (req.session.id == null) {
    return next();
  }
  if (req.wantsJSON) {
    return res.forbidden('You are not permitted to perform this action.');
  }
  return res.redirect('/');
}