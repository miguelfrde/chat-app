const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({  // eslint-disable-line new-cap
  username: {type: String, unique: true, required: true, dropDups: true},
  contacts: [{type: mongoose.Schema.ObjectId, ref: 'User', unique: true}]
});

UserSchema.methods.addToContacts = function (user, cb) {
  return User.update(this, {$addToSet: {contacts: user}}, () => {
    User.update(user, {$addToSet: {contacts: this}}, cb);
  });
};

UserSchema.methods.removeFromContacts = function (user, cb) {
  return User.update(this, {$pull: {contacts: user._id}}, () => {
    User.update(user, {$pull: {contacts: this._id}}, cb);
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  UserSchema: UserSchema,
  User: User
};
