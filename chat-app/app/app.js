import {App, Platform} from 'ionic/ionic';
import {Http} from 'angular2/http';
import * as _ from 'lodash';
import {MainPage} from './pages/main/main';
import {Auth} from './providers/auth';
import {Chat} from './providers/chat';
import {Contacts} from './providers/contacts';
import {Conversations} from './providers/conversations';
import {CameraProvider} from './providers/camera';
import {Me} from './providers/me';
import {PullNotifications} from './providers/pull-notifications';
import config from './config';


@App({
  templateUrl: 'build/app.html',
  providers: [Auth, CameraProvider, Chat, Contacts, Conversations, Me, PullNotifications]
  config: {
    mode: 'md'
  }
})
export class ChatApp {
  constructor(platform: Platform, public http: Http) {
    this.root = MainPage;

    let timePromises = [];
    for (let i = 0; i < 5; i++) {
      timePromises.push(this.getTime());
    }
    Promise.all(timePromises).then((times) => {
      const time = _.minBy(times, 'rtt');
      config.timeDiff = (time.time + time.rtt/2) - time.startTime;
    });

    platform.ready().then(() => {
    });
  }

  getTime() {
    return new Promise((resolve, reject) => {
      const startTime = new Date().getTime();
      this.http.get(config.chatApiBase + 'time')
        .subscribe(response => {
          const rtt = new Date().getTime() - startTime;
          const data = response.json();
          resolve({
            startTime: startTime,
            time: data.time,
            rtt: rtt
          });
        });
    });
  }
}
