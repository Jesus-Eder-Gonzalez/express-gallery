const express = require('express');
const users = require('./users');
const gallery = require('./gallery');
const router = express.Router();

router.use('/users', users);
router.use('/gallery', gallery);

const Photo = require('../db/models/Photo');

router.route('/').get((req, res) => {
  let loggedIn = req.user ? true : false;
  return Photo.fetchAll()
    .then(result => {
      if (result.length === 0) {
        throw new Error('There are currently no photos.');
      }
      let rowCount = Math.ceil(result.models.length / 3);
      let rows = [];

      let tempArr = [];
      for (let i = 1; i < result.models.length - 1; i++) {
        tempArr.push(result.models[i]);
        if (i % 3 === 0) {
          rows.push({
            row: {
              col1: tempArr.pop(),
              col2: tempArr.pop(),
              col3: tempArr.pop()
            }
          });
        }
        if (i === result.models.length-2 && i%3 !==0){
          rows.push({
            row: {
              col1: tempArr.pop(),
              col2: tempArr.pop()
            }
          });

        }
      }
      console.log(rows);
      return {first_photo : result.models[0], rows};
      // return result.models;
    })
    .then(photos => {
      console.log(photos);
      return res.render('./index', { ...photos, loggedIn });
    })
    .catch(err => {
      console.log('errors', err);
      return res.render('./index', { errors: err.message });
    });
});

module.exports = router;
