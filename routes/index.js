const express = require('express');
const users = require('./users');
const gallery = require('./gallery');
const router = express.Router();

router.use('/users', users);
router.use('/gallery', gallery);

const Photo = require('../db/models/Photo');

router.route('/').get((req, res) => {
  return Photo.fetchAll()
    .then(result => {
      if (result.length === 0) {
        throw new Error('There are currently no photos.');
      }
      return result.models;
    })
    .then(photos => {
      console.log(req.body.description);

      return res.render('./index', { photos });
    })
    .catch(err => {
      console.log('errors', err);
      return res.render('./index', { errors: err.message });
    });
});

module.exports= router;