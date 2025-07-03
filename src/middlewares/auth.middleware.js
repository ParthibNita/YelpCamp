const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please log in first");
    return res.redirect("/users/login");
  }
  next();
};

// Middleware to store redirect URL as recent passport.js version deletes the session after succesful login
const redirectRoute = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

export { isLoggedIn, redirectRoute };
