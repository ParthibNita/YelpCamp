import express from "express";
import path from "path";
import methodOverride from "method-override";
import engine from "ejs-mate";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodOverride("_method")); // Middleware to support PUT, PATCH and DELETE methods in forms

app.engine("ejs", engine); // Use ejs-mate for EJS templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

export { app };
