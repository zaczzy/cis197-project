var express = require('express');
var router = express.Router();
var reviewsDb = require('../db/reviews');

// Implement the routes.
router.get('/all', function (req, res, next) {
  reviewsDb.getAllReviews(function (error, reviews) {
    if (error) {
      next(error);
    } else {
      res.send(reviews);
    }
  });
});

router.get('/search/:className', function (req, res, next) {
  reviewsDb.getReviewsByClassName(req.params.className, function (error, reviews) {
    if (error) {
      next(error);
    } else {
      res.send(reviews);
    }
  });
});
module.exports = router;
