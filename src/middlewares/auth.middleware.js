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

const isAuthor = (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  console.log(req.user._id);

  if (!req.user._id.equals(id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

export { isLoggedIn, redirectRoute, isAuthor };
