const express = require('express');
const router = express.Router();
const isAuthenticated = require('../helper/authenticated');
const Photo = require('../db/models/Photo');

router.route('/').post(isAuthenticated, (req, res) => {
  if (!(req.user.username === req.body.author_username)) {
    return res.status(401).send('UNAUTHORIZED');
  }
  let { author_username, link, description, title } = req.body;
  if (!(author_username.length && link.length && description.length && title.length)) {
    res.app.locals.error = { reason: 'You need to fill in all the fields' };
  }
  author_username = author_username.trim();
  link = link.trim().toLowerCase();
  title = title.trim();

  return new Photo({
    author_username,
    title,
    link,
    description
  })
    .save({ require: true })
    .then(() => {
      return res.redirect('/');
    })
    .catch(err => {
      res.app.locals.body = req.body;
      res.redirect('/gallery/new');
    });
});

router.route('/new').get(isAuthenticated, (req, res) => {
  if (!req.user) {
    return res.status(401).send('UNAUTHORIZED');
  }
  let renderParams = {
    author_username: req.user.username,
    reason: res.app.locals.error,
    ...res.app.locals.body
  };
  res.app.locals.error = '';
  res.app.locals.body = '';
  res.render('./gallery/new', renderParams);
});

router.route('/:id/edit').get(isAuthenticated, (req, res) => {
  return Photo.where('id', req.params.id)
    .fetch({ require: true })
    .then(photo => {
      if (!(req.user.username === photo.attributes.author_username)) {
        return res.status(401).send('UNAUTHORIZED');
      }
      return res.render('./gallery/edit', photo.attributes);
    })
    .catch(err => {
      console.log(err);
      res.app.locals.error = err.message;
      res.status(400).redirect('/');
    });
});

router
  .route('/:id')
  .get((req, res) => {
    let authorized = false;
    return Photo.where('id', req.params.id)
      .fetch({
        withRelated: [
          'author.photos',
          {
            'author.photos': function(qb) {
              qb.where('id', '<>', req.params.id);
            }
          }
        ]
      })
      .then(result => {
        if (req.user) {
          if (req.user.username === result.attributes.author_username) {
            authorized = true;
          }
        }
        return result.toJSON();
      })
      .then(photos => {
        return res.render('./gallery/photo', {
          authorized,
          ...photos,
          photos: photos.author.photos
        });
      })
      .catch(err => {
        console.log('errors', err);
        return res.render('./gallery/photo', { errors: err.message });
      });
  })
  .put(isAuthenticated, (req, res) => {
    if (!(req.user.username === req.body.author_username)) {
      return res.status(401).send('UNAUTHORIZED-POST');
    }
    let { author_username, link, description, title } = req.body;
    console.log(req.body);
    return new Photo({ id: req.params.id })
      .save(
        {
          author_username,
          title,
          link,
          description
        },
        { patch: true }
      )
      .then(result => {
        console.log(result);
        res.redirect(`./`);
      })
      .catch(err => {
        console.log(err.message);
      });
  })
  .delete(isAuthenticated, (req, res) => {
    if (!(req.user.username === req.body.author_username)) {
      return res.status(401).send('UNAUTHORIZED');
    }
    return new Photo({ id: req.params.id })
      .destroy()
      .then(result => {
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
      });
  });

module.exports = router;
