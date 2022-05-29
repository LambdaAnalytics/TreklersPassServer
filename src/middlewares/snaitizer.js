exports.snaitizerUser = () => (req, res, next) => {
  delete req.body.isEmailVerified;
  delete req.body.roles;
  delete req.body.id;
  return next();
};
