const express = require('express');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const sessionConfig = require('./sessionConfig');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toUpperCase().split("\n");
const indexRoutes = require('./routes/indexRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const path = require('path');
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});
app.engine('mustache', mustacheExpress);
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));
app.use(expressValidator);

app.use('/', indexRoutes);
app.use('/game', gameRoutes);