export class Message {
  from: string;
  to: string;
  content: string;
  conversation: string;
  timestamp: int;
  type: string;

  constructor(obj: any, setTime = false) {
    this.timestamp = obj.timestamp || null;
    this.from = obj.from || null;
    this.to = obj.to || null;
    this.content = obj.content || null;
    this.conversation = obj.conversation || null;
    this.type = obj.type || 'text';

    if (setTime) {
      this.timestamp = new Date().getTime();
    }
  }
}
