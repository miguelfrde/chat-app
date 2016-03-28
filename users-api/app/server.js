#!/usr/bin/env node

const app = require('./lib/app')
    , config = require('./lib/config')
    , fs = require('fs')
    , mongoose = require('mongoose')
    , path = require('path');

const connect = () => {
  const options = {server: {socketOptions: {keepAlive: 1}}};
  mongoose.connect(config.db, options);
};

connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

fs.readdir(path.join(__dirname, '/lib/models'), (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach((file) => {
    if (file.indexOf('.js') !== -1) {
      require(path.join(__dirname, '/lib/models/', file));  // eslint-disable-line global-require
    }
  });
});

app.set('port', process.env.PORT || 5000);

const server = app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${server.address().port}`);
});
