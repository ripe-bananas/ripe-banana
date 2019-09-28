// eslint-disable-next-line new-cap
const router = require('express').Router();
const Actor = require('../models/actor-model');
const Film = require('../models/film-model');

router
  .post('/', (req, res, next) => {
    Actor.create(req.body)
      .then(actor => res.json(actor))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor.find()
      .lean()
      .select('name')
      .then(actors => res.json(actors))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Actor.findById(req.params.id)
      .lean()
      // THIS IS WHERE WE LEFT OFF
    Film.find({ cast.actor: req.params.id })
      .then(actor => res.json(actor))
      .catch(next);
  });

module.exports = router;