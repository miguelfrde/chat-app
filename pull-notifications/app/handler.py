import logging
from pymongo import MongoClient


def message_to_dict(message):
    return {
        'to': message.dest,
        'from': message.src,
        'content': message.content,
        'type': message.type,
        'timestamp': message.timestamp
    }


client = MongoClient('mongo', 27017)
db = client['pending-messages']

logging.basicConfig(level=logging.DEBUG)


class NotificationServiceHandler:
    def postMessage(self, message):
        logging.info('Saving message for {0}'.format(message.dest))
        db.notifications.update_one(
            {'username': message.dest},
            {'$push': {'pending': message_to_dict(message)}},
            upsert=True)
