import {Page, NavController, ViewController, Alert} from 'ionic/ionic';
import {Auth} from '../../providers/auth';
import {Chat} from '../../providers/chat';
import {Me} from '../../providers/me';


@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginModal {
  constructor(nav: NavController, viewCtrl: ViewController, me: Me, auth: Auth, chat: Chat) {
    this.username = '';
    this.viewCtrl = viewCtrl;
    this.meProvider = me;
    this.authProvider = auth;
    this.chatProvider = chat;
    this.nav = nav;
  }

  login(event) {
    if (this.username.length) {
      this.authProvider.login(this.username).then((token) => {
        this.meProvider.create(this.username).then((me) => {
          this.chatProvider.socketAuth(token);
          this.viewCtrl.dismiss(me);
        });
      });
    } else {
      let alert = Alert.create({
        title: 'Invalid username',
        subTitle: 'The username you enetered is empty!',
        buttons: ['Ok']
      });
      this.nav.present(alert);
    }
  }
}
