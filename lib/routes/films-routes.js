// eslint-disable-next-line new-cap
const router = require('express').Router();
const Film = require('../models/film-model');


router
  .post('/', (req, res, next) => {
    Film.create(req.body)
      .then(film => res.json(film))
      .catch(next);
  });

  // .get('/', (req, res, next) => {
  //   Film.find()
  //     .lean()
  //     .select('title')
  //     .then(films => res.json(films))
  //     .catch(next);
  // })

  // .get('/:id', (req, res, next) => {
  //   Promise.all([
  //     Film.findById(req.params.id)
  //       .lean(),
  //     Review.find({ film: req.params.id })
  //       .select('rating review')
  //       .lean()
  //   ])
  //     .then(([film, reviews]) => {
  //       film.reviews = reviews;
  //       res.json(film);
  //     })
  //     .catch(next);
  // })

  // .put('/:id', (req, res, next) => {
  //   Film.findByIdAndUpdate(req.params.id, req.body, { new: true })
  //     .then(film => res.json(film))
  //     .catch(next);
  // });

module.exports = router;