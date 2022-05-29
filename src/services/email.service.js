const nodemailer = require('nodemailer');
const ejs = require('ejs');
const config = require('../config/config');
const logger = require('../config/logger');

let transport;
/* istanbul ignore next */
if (config.email && config.email.smtp) {
  transport = nodemailer.createTransport(config.email.smtp);
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch((e) => {
      logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env', e);
    });
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  if (transport) await transport.sendMail(msg);
  else logger.error('Email not configured');
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.server.endpoint}/reset-password?token=${encodeURIComponent(token)}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.server.endpoint}/v1/auth/verify-email?token=${encodeURIComponent(token)}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Create a user
 * @param {Object} user
 * @returns {Promise<Any>}
 */
const sendWelcomeEmail = async (user, token) => {
  ejs
    .renderFile('views/welcome-email.ejs', {
      user,
      app: config.app,
      confirmLink: `${config.SERVER_HOST}/auth/confirm-email?token=${encodeURIComponent(token)}`,
    })
    .then(async (result) => {
      const emailTemplate = result;
      logger.info(`sending email to ${user.email}`);
      await sendEmail(
        user.email,
        `Welcome To ${config.app.name}! Your Account Has Been Successfully Created`,
        undefined,
        emailTemplate,
      );
    })
    .catch((e) => {
      logger.error(`Unable to send email to ${user.email}`);
      logger.error(e);
    });
};

module.exports = {
  transport,
  sendEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
