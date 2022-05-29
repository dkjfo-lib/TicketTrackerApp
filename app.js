const express = require("express");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

dotenv.config({ path: "config/config.env" });

connectDB();

const app = express();
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// handlebars setting
app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Router setting
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
