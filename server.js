const express = require("express");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");
const session = require("express-session");
const logger = require("morgan");
const mustacheExpress = require("mustache-express");
const path = require("path");
const fs = require("fs");
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toUpperCase().split("\n");
const sessionConfig = require("./sessionConfig");
const indexRoutes = require('./routes/indexRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const port = process.env.PORT || 8000;

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.listen(port, () => {
    console.log(`Currently running on port ${port}.`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));
app.use(expressValidator());
app.use(logger('dev'));

app.use('/', indexRoutes);
app.use('/game', gameRoutes);
