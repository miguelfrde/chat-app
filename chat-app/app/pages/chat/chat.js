import {NavController, NavParams, Page, IonicApp, Events} from 'ionic/ionic';
import {Message} from '../../models/message';
import {CameraProvider} from '../../providers/camera';
import {Chat} from '../../providers/chat';
import {Conversations} from '../../providers/conversations';
import {Contacts} from '../../providers/contacts';
import {Me} from '../../providers/me';
import {timestampToString} from '../../utils'


@Page({
  templateUrl: 'build/pages/chat/chat.html'
})
export class ChatPage {
  constructor(public nav: NavController,
              public events: Events,
              public params: NavParams,
              public app: IonicApp,
              public cameraProvider: CameraProvider,
              public chatProvider: Chat,
              public conversationsProvider: Conversations,
              public contactsProvider: Contacts,
              public meProvider: Me) {
    this.other = this.contactsProvider.get(params.data.other);
    this.newMessage = '';

    this.meProvider.get((me) => {
      this.me = me;
      this.people = {};
      this.people[this.other.username] = this.other;
      this.people[this.me.username] = this.me;
      this.loadConversation();
    });

    this.events.subscribe('newMessage', (message) => {
      const msg = message[0];
      if (msg.to === this.me.username && msg.from == this.other.username) {
        this.addMessage(msg);
      }
    });

    this.timestampToString = timestampToString;
  }

  loadConversation() {
    this.conversation = [];
    this.conversationsProvider.get(this.other.username).then((messages) => {
      this.conversation = messages;
    });
  }

  ngAfterViewInit() {
    this.content = this.app.getComponent('chat');
    this.autoScroll();
  }

  addMessage(message: Message) {
    this.conversation.push(message);
    this.autoScroll();
  }

  autoScroll() {
    // Ugly hack, not possible to auto assign this.content.elementRef.nativeElement.scrollTop
    this.content.scrollTo(0, 10000000, 200);
  }

  sendText(event) {
    if (this.newMessage) {
      const message = new Message({
        from: this.me.username,
        to: this.other.username,
        content: this.newMessage,
        conversation: this.other.username
      }, setTime = true);
      this._sendMessage(message);
      this.newMessage = '';
    }
  }

  sendPicture(event) {
    this.cameraProvider.takePicture((data) => {
      const message = new Message({
        from: this.me.username,
        to: this.other.username,
        content: data,
        conversation: this.other.username,
        type: 'picture'
      }, setTime = true);
      this._sendMessage(message);
    });
  }

  _sendMessage(message: Message) {
    this.addMessage(message);

    this.chatProvider.sendMessage(message).then(() => {
      this.autoScroll();
    });
  }
}
