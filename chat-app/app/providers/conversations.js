import {Injectable} from 'angular2/core';
import {Events, Storage, SqlStorage} from 'ionic/ionic';
import {Message} from '../models/message';
import * as _ from 'lodash';


@Injectable()
export class Conversations {
  constructor(public events: Events) {
    this.storage = new Storage(SqlStorage);
    this.events.subscribe('newMessage', (message) => {
      this.addMessage(message[0]);
    });
  }

  init(cb) {
    this.storage.query(`create table if not exists messages (
      id integer primary key, sender text, dest text, content text, conversation text, type text, timestamp number)
    `).then(cb);
  }

  reset() {
    this.storage.query('drop table if exists messages');
  }

  get(other: string) {
    return new Promise((resolve, reject) => {
      this.storage.query(`select * from messages where conversation = '${other}' order by id`).then((result) => {
        const messages = _.map(result.res.rows, (message) => {
          return new Message({
            from: message.sender,
            dest: message.dest,
            content: message.content,
            conversation: message.conversation,
            type: message.type,
            timestamp: message.timestamp
          });
        });
        resolve(messages);
      }, (err) => {
        reject(err);
      })
    });
  }

  getJustLastMessage(other: string) {
    return new Promise((resolve, reject) => {
      this.storage.query(`select * from messages where conversation = '${other}' order by id desc limit 1`).then((result) => {
        if (result.res.rows.length) {
          resolve(result.res.rows[0]);
        } else {
          resolve({
            conversation: other,
            content: ''
          });
        }
      }, (err) => {
        reject(err);
      })
    });;
  }

  addMessage(msg: Message) {
    return this.storage.query(`insert into messages(sender, dest, content, conversation, type, timestamp) values(
      "${msg.from}", "${msg.to}", "${msg.content}", "${msg.conversation}", "${msg.type}", ${msg.timestamp})`);
  }
}

