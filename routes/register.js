var express = require('express');
var router = express.Router();
var db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register', err: '' });
});

router.post('/', function (req, res, next) {
  db.sequelize.sync().then(function () {
    db.User.create({
      user: req.body['username'],
      pass: req.body['password'],
      coins: 10
    }).then(function () {
      res.redirect('/login');
    }).catch(err => {
      res.render('register', { title: 'Register', err: err });
    })
  });
});

module.exports = router;
