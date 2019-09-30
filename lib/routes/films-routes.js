// eslint-disable-next-line new-cap
const router = require('express').Router();
const Film = require('../models/film-model');
const Review = require('../models/review-model');


router
  .post('/', (req, res, next) => {
    Film.create(req.body)
      .then(film => res.json(film))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Film.find()
      .lean()
      .populate('studio', 'name')
      // .select('title released studio')
      .then(films => res.json(films))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    return Promise.all([
      Film.findById(req.params.id)
        .lean()
        .populate('studio', 'name')
        .populate('cast.actor', 'name'),
      Review.find({ film: req.params.id })
        .lean()
        .select('rating review reviewer')
        .populate('reviewer', 'name')
    ])
      .then(([film, reviews]) => {
        film.reviews = reviews;
        res.json(film);
      })
      .catch(next);
  });

// .put('/:id', (req, res, next) => {
//   Film.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then(film => res.json(film))
//     .catch(next);
// });

module.exports = router;