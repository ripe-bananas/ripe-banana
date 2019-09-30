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
    return Promise.all([
      Actor.findById(req.params.id)
        .lean(),
      Film.where('cast.actor', req.params.id)
        // { cast: [{ actor: req.params.id }] }
        // { actor: req.params.id }
        .lean()
        .select('title released')
    ])
      .then(([actor, films]) => {
        console.log(films);
        actor.films = films;
        res.json(actor);
      })
      .catch(next);
  });

module.exports = router;