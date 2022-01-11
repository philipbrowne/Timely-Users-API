'use strict';

/** Routes for authentication. */

const jsonschema = require('jsonschema');

const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const { createToken } = require('../helpers/tokens');
const userAuthSchema = require('../schemas/userAuth.json');
const userRegisterSchema = require('../schemas/userRegister.json');
const userResetPasswordSchema = require('../schemas/userResetPassword.json');
const { BadRequestError } = require('../expressError');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  process.env.SENDGRID_API_KEY ||
    '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'
);

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post('/token', async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post('/register', async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/recover   { email } => { password reset email }
 *
 * user must include { email }
 *
 * Sends email to user with a special single-use URL to reset password.
 *
 * Authorization required: none
 */

router.post('/recover', async function (req, res, next) {
  try {
    const userCheck = await User.findUserEmail(req.body.email);
    const user = await User.generatePasswordReset(userCheck.username);
    const resetURL = `http://${req.headers.host}/auth/reset/${user.resetPasswordToken}`;
    const mailOptions = {
      to: user.email,
      from: 'pbrowne@gmail.com',
      subject: 'Password Reset Request',
      text: `Hello ${user.username}\n\nPlease visit ${resetURL} to reset your password.\n\nIf you did not request this, please ignore this email.`,
    };
    sgMail.send(mailOptions, (err, result) => {
      if (err) return next({ message: err.message });
      return res.status(200).json({
        message: `A reset email has been sent to ${user.email} - please check your spam folder.`,
      });
    });
  } catch (err) {
    return next(err);
  }
});

/** GET /auth/reset/:token
 *
 * Simple Form to Reset User Password
 *
 * Authorization required: none
 */

router.get('/reset/:token', async function (req, res, next) {
  try {
    const user = await User.verifyPasswordToken(req.params.token);
    return res.render('reset', user);
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/reset/:token
 *
 * Sends form data from Password Reset - must have valid password of 6-20 characters.  Password and Confirm Password must match.
 *
 * Authorization required: none
 */

router.post('/reset/:token', async function (req, res, next) {
  try {
    const userCheck = await User.verifyPasswordToken(req.params.token);
    const validator = jsonschema.validate(req.body, userResetPasswordSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    if (req.body.password !== req.body.confirmPassword)
      throw new BadRequestError({
        error: 'Password and Confirm Password Must Be the Same',
      });
    await User.resetPassword(userCheck.username, req.body.password);
    const mailOptions = {
      to: user.email,
      from: 'pbrowne@gmail.com',
      subject: 'Password Reset Confirmation',
      text: `Hello ${user.username}\n\nYour password was recently reset.`,
    };
    sgMail.send(mailOptions, (err, result) => {
      if (err) return next(err);
      return res.status(200).json({
        message:
          'Your password has been successfully updated.  Please get a new token at /auth/token with your updated credentials.',
      });
    });
    return res.json({ message: 'ok' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
