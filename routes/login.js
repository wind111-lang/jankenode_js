var express = require('express');
const db = require('../models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', err: ''});
});

router.post('/submit', function (req, res, next) {
  var name = req.body['username'];
  db.User.findOne({
    where: {
      user: req.body['username'],
      pass: req.body['password']
    }
  }).then(function (result) { 
    if (result != null) {
      req.session.username = name;
      res.redirect('/');
    } else { 
          res.render('login', { title: 'Login', err: 'Invalid username or password!' });
    }
  })
})

module.exports = router;
