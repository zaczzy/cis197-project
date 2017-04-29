var express = require('express');
var router = express.Router();
var User = require('../db/mongo').User;
// Implement the routes.
router.get('/', function (req, res) {
  if (req.session.username && req.session.username !== '') {
    if (req.session.admin) {
      res.render('post-articles')
    } else {
      res.redirect('/view-articles');
    }
    
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
        req.session.admin = false;
        res.redirect('view-articles');
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
  User.addUser(req.body.username, req.body.password, false, function (err) {
    if (err) res.send('error' + err);
    else res.send('new user registered with username ' + req.body.username);
  });
});


router.get('/logout', function (req, res) {
  req.session.username = '';
  res.render('logout');
});

router.get('/view-articles', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
    res.render('view-articles', {username: req.session.username});
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
        req.session.admin = true;
        res.render('post-articles', {message: "Start Posting!"});
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
  User.addUser(req.body.username, req.body.password, true, function (err) {
    if (err) res.send('Error: ' + err);
    else res.send('New admin created!');
  });
});

router.get('/setAdminPassword', function (req, res, next) {
  res.render('admin-register');
});

router.post('/setAdminPassword', function (req, res, next) {
  User.setAdminPassword(req.body.username, req.body.password, true, function (err) {
    if (err) res.send('Error: ' + err);
    else res.send('Password Changed!');
  });
});

module.exports = router;
