const express = require('express')
    , User = require('./models/user').User;

const router = express.Router();  // eslint-disable-line new-cap

router.use('/users/:username', (req, res, next) => {
  const username = req.params.username.toLowerCase();
  User.findOne({username: username})
    .populate('contacts', 'username')
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({detail: `Something unexpected happened while trying to get ${username}`});
      }
      if (!user && req.method !== 'POST') {
        return res.status(404).json({detail: `User ${username} not found.`});
      }
      req.user = user;
      return next();
    });
});


router.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    return res.json({users: users});
  });
});

router.get('/users/:username', (req, res) => {
  return res.send(req.user);
});


router.post('/users/:username', (req, res) => {
  if (req.user) {
    return res.status(400).json({detail: 'User already exists', user: req.user});
  }

  const user = new User({username: req.params.username.toLowerCase()});

  return user.save((err) => {
    if (err) {
      const errorMessage = `Something unexpected happend. User ${req.params.username} could not be saved.`;
      return res.status(500).json({detail: errorMessage});
    }
    return res.json({detail: 'created'});
  });
});


router.delete('/users/:username', (req, res) => {
  return User.remove(req.user, (err) => {
    if (err) {
      const errorMessage = `Something unexpected happened. User ${req.params.username} could not be deleted.`;
      return res.status(500).json({detail: errorMessage});
    }
    return res.json({detail: 'deleted'});
  });
});


router.get('/users/:username/contacts', (req, res) => {
  return res.json({contacts: req.user.contacts});
});


router.post('/users/:username/contacts/:other', (req, res) => {
  User.findOne({username: req.params.other.toLowerCase()}, (err, other) => {
    if (err) {
      return res.status(500).json({detail: 'Something unexpected happened. Contact not added'});
    }
    if (!other) {
      return res.status(404).json({detail: `User ${req.params.other} not found.`});
    }
    req.user.addToContacts(other, (err) => {
      if (err) {
        return res.status(500).json({detail: 'Something unexpected happened. Contact not added'});
      }
      return res.json({detail: 'added'});
    });
  });
});


router.delete('/users/:username/contacts/:other', (req, res) => {
  return User.findOne({username: req.params.other.toLowerCase()}, (err, other) => {
    if (err) {
      console.log(err);
      return res.status(500).json({detail: 'Something unexpected happened. Contact not removed'});
    }
    if (!other) {
      return res.status(404).json({detail: `User ${req.params.other} not found.`});
    }
    req.user.removeFromContacts(other, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({detail: 'Something unexpected happened. Contact not added'});
      }
      return res.json({detail: 'removed'});
    });
  });
});


module.exports = router;
