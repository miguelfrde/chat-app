from flask import Flask, jsonify
from flask.ext.pymongo import PyMongo
from flask.ext.cors import CORS


app = Flask(__name__)
CORS(app)
app.config['MONGO_URI'] = 'mongodb://mongo:27017/pending-messages'
mongo = PyMongo(app)


@app.route('/notifications/<username>')
def notifications(username):
    user = mongo.db.notifications.find_one({'username': username})
    if user:
        mongo.db.notifications.delete_one({'username': username})
        return jsonify(messages=user['pending'])
    return jsonify(messages=[])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
