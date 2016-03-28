import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Storage, SqlStorage} from 'ionic/ionic';
import config from '../config';


@Injectable()
export class Me {
  constructor(public http: Http) {
    this.storage = new Storage(SqlStorage);
  }

  create(username: string) {
    return new Promise((resolve, reject) => {
      this.http.post(config.usersApiBase + `${username}`)
        .subscribe(data => {
          const result = data.json();
          if (result.detail === 'created') {
            const me = {username: username, picture: config.userPic};
            this.storage.set('me', JSON.stringify({username: username, picture: config.userPic}));
            resolve(me);
          }
          reject(result);
        },
        err => {
          if (err.status === 400) {
            const data = JSON.parse(err._body);
            if (data.user) {
              this.storage.set('me', JSON.stringify({username: data.user.username, picture: config.userPic}));
              resolve(data.user);
            } else {
              reject(err);
            }
          } else {
            reject(err);
          }
        });
    });
  }

  get(cb) {
    return this.storage.get('me').then((data) => {
      cb(JSON.parse(data));
    });
  }

  logout() {
    this.storage.remove('me');
  }
}
