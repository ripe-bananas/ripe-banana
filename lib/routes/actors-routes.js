// eslint-disable-next-line new-cap
const router = require('express').Router();
const Actor = require('../models/actor-model');

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
  });

module.exports = router;