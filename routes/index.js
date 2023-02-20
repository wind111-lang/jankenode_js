var express = require('express');
const db = require('../models');
var router = express.Router();

/* GET home page. */
function check(req, res) {
  var user = req.session['username'];
  if (user == null) {
    res.redirect('/login');
    return true;
  } else {
    return false;
  }
}

router.get('/', function (req, res, next) {
  if (check(req, res)) {
    return;
  }
  db.User.findAll({
    where: {
      user: req.session['username'],
    }
  }).then(function (result) {
    res.render('index', { title: 'Janken', user: result[0].user, coins: result[0].coins });
  })
});

router.post('/result', function (req, res, next) {
  var getCoins = req.body['gotCoins'];
  console.log(getCoins);
  db.sequelize.sync().then(function () {
    db.User.update({
      coins: getCoins
    }, {
      where: {
        user: req.session['username']
      }
    })
  })
  res.redirect('/');
});

router.post('/refill', function (req, res, next) {
  var getCoins = parseInt(req.body['coins'], 10);
  db.sequelize.sync().then(function () {
    db.User.update({
      coins: getCoins + 10
    }, {
      where: {
        user: req.session['username']
      }
    })
  })
  res.redirect('/');
});

router.post('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
