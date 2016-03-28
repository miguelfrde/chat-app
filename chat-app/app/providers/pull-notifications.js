import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Events} from 'ionic/ionic';
import {Message} from '../models/message';
import config from '../config';

@Injectable()
export class PullNotifications {
  constructor(public http: Http, public events: Events) {
    this.interval = null;
  }

  init(me) {
    this.checkForNotifications(me);
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.internval = setInterval(() => {
      this.checkForNotifications(me);
    }, 15000);
  }

  checkForNotifications(me) {
    this.http.get(config.notificationsBaseUrl + `${me}`)
      .subscribe(data => {
        const result = data.json();
        result.messages.forEach((message) => {
          const msg = new Message(Object.assign({conversation: message.from}, message));
          this.events.publish('newMessage', msg);
        });
      });
  }
}
