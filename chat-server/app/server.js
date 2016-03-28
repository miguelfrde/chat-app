'use strict';

const app = require('express')();
const chalk = require('chalk');
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const SocketIoJwt = require('socketio-jwt');

const config = require('./config');
const tclient = require('./thrift-client');

let connections = {};

app.use(cors());
app.use(morgan('dev'));

app.get('/token', (req, res) => {
  if (req.query.username) {
    return res.json({token: jwt.sign({username: req.query.username}, config.secret)});
  } else {
    return res.status(400).send('No username in the payload');
  }
});

app.get('/time', (req, res) => {
  return res.json({time: new Date().getTime()})
});


io.on('connection', SocketIoJwt.authorize({
  secret: config.secret,
  timeout: 15000
})).on('authenticated', (socket) => {
  socket.username = socket.decoded_token.username;
  connections[socket.username] = socket;

  console.log(chalk.green('User', socket.username, 'connected.'));

  socket.on('disconnect', () => {
    console.log(chalk.red('User', socket.username, 'disconnected.'));
    delete connections[socket.username];
  });

  socket.on('sendMessage', (msg, cb) => {
    msg.timestamp = new Date().getTime();
    if (msg.to in connections) {
      const otherMessage = Object.assign({}, msg, {
        conversation: (msg.from === msg.conversation && msg.to) || msg.from
      });
      connections[msg.to].emit('newMessage', otherMessage);
    } else {
      tclient.postMessage(msg);
    }
    return cb({status: true});
  });
});


http.listen(3000, () => {
  console.log('chat-server listening on port 3000');
});
