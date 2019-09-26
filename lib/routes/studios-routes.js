// eslint-disable-next-line new-cap
const router = require('express').Router();
const Studio = require('../models/studio-model');

router
  .post('/', (req, res, next) => {
    Studio.create(req.body)
      .then(studio => res.json(studio))
      .catch(next);
  });

module.exports = router;