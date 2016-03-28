import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import * as _ from 'lodash';
import config from '../config';


@Injectable()
export class Contacts {
  constructor(public http: Http) {
    this.contacts = {};
  }

  init(me, cb) {
    return this.http.get(config.usersApiBase + `${me}/contacts`)
      .subscribe(data => {
        const result = data.json();
        this.contacts = _.reduce(result.contacts, (acc, item) => {
          acc[item.username] = {username: item.username, picture: config.userPic};
          return acc;
        }, {});
        cb(this.contacts);
      });
  }

  all() {
    if (!this.contacts) {
      throw 'Contacts have to be initialized';
    }
    return this.contacts;
  }

  get(username: string) {
    if (!this.contacts) {
      throw 'Contacts have to be initialized';
    }
    return this.contacts[username];
  }

  post(me: string, username: string) {
    return new Promise((resolve, reject) => {
      if (!this.contacts[username]) {
        this.http.post(config.usersApiBase + `${me}/contacts/${username}`)
          .subscribe(data => {
            this.contacts[username] = {username: username, picture: config.userPic};
            resolve(data);
          }, err => {
            reject(err.json());
          });
      }
    });
  }
}
