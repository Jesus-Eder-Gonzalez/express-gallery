'use strict';

const express = require('express');
const session = require('express-session');
const Redis = require('connect-redis')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const hiddenMethodParser = require('./helper/hiddenMethodParser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

const saltedRounds = 12;

const PORT = process.env.PORT || 15000;
const User = require('./db/models/User');
const app = express();
const routes = require('./routes');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  methodOverride((req, res) => {
    return hiddenMethodParser(req, res);
  })
);

app.use(
  session({
    store: new Redis(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
);

app.use(flash());

app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  new User({ id: user.id })
    .fetch()
    .then(user => {
      if (!user) {
        throw new Error('User not logged in ');
      }
      user = user.toJSON();
      return done(null, {
        id: user.id,
        username: user.username
      });
    })
    .catch(err => {
      return done(err);
    });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch({ require: true })
      .then(user => {
        user = user.toJSON();
        if (user === null) {
          return done(null, false, { message: 'bad username or password' });
        } else {
          bcrypt.compare(password, user.password).then(samePassword => {
            if (samePassword) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'bad username or password' });
            }
          });
        }
      })
      .catch(err => {
        console.log('error: ', err);
        return done(err);
      });
  })
);

app.set('view engine', '.hbs');

app.get('/register', (req, res) => {
  res.render('./users/new');
});

app.post('/register', (req, res) => {
  bcrypt.genSalt(saltedRounds, (err, salt) => {
    if (err) {
      return res.status(500);
    }
    bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
      if (err) {
        return res.status(500);
      }
      return new User({
        username: req.body.username,
        password: hashedPassword,
        name: req.body.name,
        email: req.body.email
      })
        .save()
        .then(user => {
          res.redirect('/');
        })
        .catch(err => {
          return res.send('Could not register you');
        });
    });
  });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {

    if (err) {
      req.flash('error', {message:'Incorrect username or password'});
      req.flash('username', req.body.username);

      return res.status(404).redirect('/login');
    }

    if (!user) {
      if (!req.body.username.length) {
        req.flash('error', { username: 'Fill in the username' });
      }
      if (!req.body.password.length) {
        req.flash('error', { password: 'Fill in the password' });
      }
      req.flash('username', req.body.username);
      return res.status(400).redirect('/login');
    }

    req.login(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

app.get('/login', (req, res) => {
  res.render('./users/login', {
    reasons: req.flash('error'),
    username: req.flash('username')
  });
});

app.use('/', routes);

app.listen(PORT, 'localhost', () => {
  console.log(`Server listening on port: ${PORT}`);
});
