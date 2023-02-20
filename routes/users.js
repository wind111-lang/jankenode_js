var express = require('express');
var router = express.Router();
const db = require('../models');

function check(req, res) {
  var user = req.session['username'];
  if (user == null) {
    res.redirect('/login');
    return true;
  } else {
    return false;
  }
}

function GetUserInfo(req, res) {
  db.User.findOne({
    where: {
      user: req.session['username'],
    }
  }).then(function (result) {
    return result;
  })
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (check(req, res)) {
    return;
  }
  db.User.findOne({
    where: {
      user: req.session['username'],
    }
  }).then(function () {
    res.render('users', { title: 'User Management', message: req.session['username'] + 'さん, こんにちは!' });
  })
});

router.get('/update', function (req, res, next) {
  if (check(req, res)) {
    return;
  }
  res.render('update', {
    title: 'Update', message: 'ユーザ情報を更新するには，以下のフォームに入力してください．現在の情報をキープする際も入力してください．', err: ''
  });
});

router.get('/delete', function (req, res, next) {
  res.render('delete', { title: 'Delete', message: 'ユーザ情報を削除しますか？この操作は取り消しできません!' });
});

router.post('/update', function (req, res, next) {
  var newuser = req.body['username'];
  var newpass = req.body['password'];

  //console.log(req.session['username'], oldpass, newuser, newpass)
  db.User.update({
    user: newuser,
    pass: newpass,
  }, {
    where: {
      user: req.session['username']
    }
  }).then(function () {
    res.render('users', { title: 'User Management', message: 'ユーザ情報を更新しました!', err: '' });
  }).catch(err => {
    res.render('update', { title: 'Update', message: 'ユーザ情報を更新するには，以下のフォームに入力してください．', err: err });
  })
});

router.post('/delete', function (req, res, next) {
  db.User.destroy({
    where: {
      user: req.session['username']
    }
  }).then(function () {
    req.session.destroy();
    res.redirect('/login');
  })
});



module.exports = router;
