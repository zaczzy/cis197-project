var express = require('express');
var router = express.Router();
var User = require('../db/mongo').user;

// Implement the routes.
router.get('/', function (req, res) {
  if (req.session.username && req.session.username !== '') {
    res.redirect('/index');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', function (req, res) {
  username = req.body.username;
  password = req.body.password;
  User.checkIfLegit(username, password, function (err, isRight) {
    if (err) {
      res.send('Error! ' + err);
    } else {
      if (isRight) {
        req.session.username = username;
        res.redirect('/index');
      } else {
        res.send('wrong password');
      }
    }
  });
});
router.get('/register', function (req, res) {
  res.render('register');
});

router.post('/register', function (req, res) {
  User.addUser(req.body.username, req.body.password, function (err) {
    if (err) res.send('error' + err);
    else res.send('new user registered with username ' + req.body.username);
  });
});


router.get('/logout', function (req, res) {
  req.session.username = '';
  res.render('logout');
});
router.get('/index', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
    res.render('index', {username: req.session.username});
  }
});

router.get('/loginAdmin', function (req, res, next) {
  res.render('admin-login');
});

router.post('/loginAdmin', function (req, res, next) {
  username = req.body.username;
  password = req.body.password;
  User.checkIfLegit(username, password, function (err, isRight) {
    if (err) {
      res.send('Error! ' + err);
    } else {
      if (isRight) {
        req.session.username = username;
        res.redirect('/index');
      } else {
        res.send('wrong admin password');
      }
    }
  });
});

router.get('/registerAdmin', function (req, res, next) {
  res.render('admin-register');
});

router.post('/registerAdmin', function (req, res, next) {
  User.updateAdmin(req.body.username, req.body.password, function (err) {
    if (err) res.send('error' + err);
    else res.send('admin password changed!');
  });
});
module.exports = router;
