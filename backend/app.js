'use strict';

/** Express app for timely. */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { NotFoundError } = require('./expressError');

const { authenticateJWT } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authenticateJWT);

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

app.get('/', function (req, res, next) {
  return res.status(200).json({
    message:
      'Welcome to Timely Users App - please register with username, password, email, firstName, and lastName at /auth/register - More information available at the documentationURL',
    documentationURL:
      'https://documenter.getpostman.com/view/16012846/UVXgMxHC',
    repoURL: 'https://github.com/philipbrowne/Timely-Users-API',
  });
});
/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
