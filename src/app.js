import express from "express";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import methodOverride from "method-override";
import engine from "ejs-mate";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static("public")); // Serve static files from the public directory
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodOverride("_method")); // Middleware to support PUT, PATCH and DELETE methods in forms

const sessionConfig = {
  secret: "temporarySecretKey", // Replace with a secure key in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Cookie expiration time (7 day)
    maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expiration time (7 day)
  },
};

app.use(session(sessionConfig)); // Middleware for session management
app.use(flash()); // Middleware for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Make flash messages available in views
  res.locals.error = req.flash("error"); // Make error messages available in views
  next();
});

app.engine("ejs", engine); // Use ejs-mate for EJS templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

export { app };
