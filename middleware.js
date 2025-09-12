module.exports.isLoggedin = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};
