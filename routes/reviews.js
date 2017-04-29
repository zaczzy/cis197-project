var express = require('express');
var router = express.Router();
var reviewsDb = require('../db/reviews');

// Implement the routes.
// Note: the rating will be passed as a string (req.body.number).
// Use Number() to transform it to a number before adding it to the database.
router.get('/new', function (req, res, next) {
  res.render('addreview');
});
router.post('/new', function (req, res, next) {
  if (req.body.title === '' || req.body.text === '') {
    res.redirect('/reviews/new');
  } else {
    reviewsDb.addReview({
      title: req.body.title,
      text: req.body.text
    }, function (error) {
      if (error) {
        next(error);
      } else {
        res.send('Successfully added an article!');
      }
    });
  }
});
module.exports = router;
