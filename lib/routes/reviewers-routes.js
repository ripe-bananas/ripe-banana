// eslint-disable-next-line new-cap
const router = require('express').Router();
const Reviewer = require('../models/reviewer-model');

router
  .post('/', (req, res, next) => {
    Reviewer.create(req.body)
      .then(reviewer => res.json(reviewer))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Reviewer.find()
      .lean()
      .then(reviewers => res.json(reviewers))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Reviewer.findById(req.params.id)
      .lean()
      .populate('reviews', 'id rating review')
      .then(reviewer => res.json(reviewer))
      .catch(next);
  })
  
  .put('/:id', (req, res, next) => {
    Reviewer.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(reviewer => res.json(reviewer))
      .catch(next);
  });

module.exports = router;