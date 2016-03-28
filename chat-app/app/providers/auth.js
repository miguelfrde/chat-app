import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Storage, SqlStorage} from 'ionic/ionic';
import config from '../config';

@Injectable()
export class Auth {
  constructor(public http: Http) {
    this.storage = new Storage(SqlStorage);
  }

  getToken(cb) {
    return this.storage.get('token').then((token) => {
      cb(token);
    });
  }

  login(username) {
    return new Promise((resolve, reject) => {
      this.http.get(config.chatApiBase + `token?username=${username}`)
      .subscribe(data => {
        const result = data.json();
        this.storage.set('token', result.token);
        resolve(result.token);
      });
    });
  }
}
