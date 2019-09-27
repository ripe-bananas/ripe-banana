// eslint-disable-next-line new-cap
const router = require('express').Router();
const Review = require('../models/review-model');

router
  .post('/', (req, res, next) => {
    Review.create(req.body)
      .then(review => res.json(review))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Review.find().sort({ rating: 1 }).limit(2)
      .lean()
      .then(reviews => res.json(reviews))
      .catch(next);
  });

  //Delete
  
module.exports = router;