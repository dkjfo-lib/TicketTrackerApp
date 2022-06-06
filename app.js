const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");
const methodOverride = require("method-override");
//const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const connectDB = require("./config/db");

dotenv.config({ path: "config/config.env" });

require("./config/passport")(passport);

connectDB();

const app = express();

// Post request body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override to use PUT and DELETE requests
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// logs
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// handlebars helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");
// handlebars setting
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Router setting
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/tickets", require("./routes/tickets"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
