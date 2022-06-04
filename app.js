const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");
//const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const connectDB = require("./config/db");

dotenv.config({ path: "config/config.env" });

require("./config/passport")(passport);

connectDB();

const app = express();
// logs
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// handlebars setting
app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
