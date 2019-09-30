// eslint-disable-next-line new-cap
const router = require('express').Router();
const Studio = require('../models/studio-model');
const Film = require('../models/film-model');

router
  .post('/', (req, res, next) => {
    Studio.create(req.body)
      .then(studio => res.json(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio.find()
      .lean()
      .then(studios => res.json(studios))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio.findById(req.params.id)
        .lean(),
      Film.find({ studio: req.params.id })
        .select('title')
        .lean()
    ])
      .then(([studio, films]) => {
        studio.films = films;
        res.json(studio);
      })
      .catch (next);
  });

//Delete 

module.exports = router;