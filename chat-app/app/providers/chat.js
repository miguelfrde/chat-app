import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Events} from 'ionic/ionic';
import * as io from 'socket.io-client';
import {Message} from '../models/message';
import config from '../config';

@Injectable()
export class Chat {
  constructor(public http: Http, public events: Events) {
  }

  socketAuth(token) {
    this.socket = io.connect(config.chatBaseUrl);
    this.socket.on('connect', () => {
      this.socket.emit('authenticate', {token: token});
    });

    this.socket.on('newMessage', (message) => {
      message.timestamp = message.timestamp + config.timeDiff;
      this.events.publish('newMessage', message);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(message: Message) {
    return new Promise((resolve, reject) => {
      this.socket.emit('sendMessage', message, (resp) => {
        if (resp.status) {
          this.events.publish('newMessage', message);
          resolve('ok');
        } else {
          reject(resp);
        }
      });
    });
  }
}
