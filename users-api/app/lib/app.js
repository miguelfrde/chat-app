const bodyParser = require('body-parser')
  , cors = require('cors')
  , express = require('express')
  , morgan = require('morgan');

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use('/', routes);

module.exports = app;
