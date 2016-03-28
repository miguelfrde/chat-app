import {Alert, NavController, Modal, Page, Events} from 'ionic/ionic';
import {ChatPage} from '../chat/chat';
import {Auth} from '../../providers/auth';
import {Chat} from '../../providers/chat';
import {Contacts} from '../../providers/contacts';
import {Conversations} from '../../providers/conversations';
import {PullNotifications} from '../../providers/pull-notifications';
import {Me} from '../../providers/me';
import {LoginModal} from '../login/login';
import {timestampToString} from '../../utils'
import * as _ from 'lodash';


@Page({
  templateUrl: 'build/pages/main/main.html'
})
export class MainPage {
  constructor(public nav: NavController,
              public events: Events,
              public meProvider: Me,
              public authProvider: Auth,
              public chatProvider: Chat,
              public contactsProvider: Contacts,
              public conversationsProvider: Conversations,
              public pullNotificationsProvider: PullNotifications) {
    this.events.subscribe('newMessage', (e) => {
      this.loadConversations();
    });

    this.meProvider.get((me) => {
      if (me) {
        this.init(me);
        this.pullNotificationsProvider.init(me.username);
      } else {
        this.showLoginModal();
      }
    });

  }

  init(me) {
    this.contactsProvider.init(me.username, () => {
      this.conversationsProvider.init(() => {
        this.loadConversations();
        this.pullNotificationsProvider.init(me.username);
      });
    });
    this.authProvider.getToken((token) => {
      this.chatProvider.socketAuth(token);
    });
  }

  showLoginModal() {
    const loginModal = Modal.create(LoginModal);
    loginModal.onDismiss((me) => {
      this.init(me);
    });
    this.nav.present(loginModal);
  }

  loadConversations() {
    this.conversations = [];
    Promise.all(_.values(this.contactsProvider.all()).map((contact) => {
      return this.conversationsProvider.getJustLastMessage(contact.username);
    })).then((lastMessages) => {
      this.conversations = lastMessages.map((lastMessage) => return {
        other: this.contactsProvider.get(lastMessage.conversation),
        lastMessage: {
          content: lastMessage.type === 'picture'? 'Image' : lastMessage.content,
          time: timestampToString(lastMessage.timestamp)
        }
      });
    });
  }

  goToConversation(event, conversation) {
    this.nav.push(ChatPage, {other: conversation.other.username});
  }

  logout(event) {
    const alert = Alert.create({
      title: 'Warning',
      body: 'If you logout the conversations saved on this device will be removed. Are you sure?',
      buttons: [{
        text: 'No',
        handler: () => {}
      }, {
        text: 'Yes',
        handler: () => {
          this.chatProvider.disconnect();
          this.meProvider.logout();
          this.conversationsProvider.reset();
          this.conversations = [];
          this.showLoginModal();
        }
      }]
    });
    this.nav.present(alert);
  }

  showAddContact(event) {
    const alert = Alert.create({
      title: 'Add contact',
      body: 'Enter the username you want to add as contact',
      inputs: [{
        name: 'username',
        placeholder: 'Username'
      }],
      buttons: [{
        text: 'Cancel',
        handler: (data) => {}
      }, {
        text: 'Add',
        handler: (data) => this.addContact(data.username)
      }]
    });
    this.nav.present(alert);
  }

  addContact(username) {
    if (username.length) {
      this.meProvider.get((me) => {
        this.contactsProvider.post(me.username, username).then(() => {
          this.loadConversations();
        }, err => {
          const alert = Alert.create({
            title: 'Error',
            body: err.detail,
            buttons: ['Ok']
          });
          this.nav.present(alert);
        });
      });
    }
  }
}
