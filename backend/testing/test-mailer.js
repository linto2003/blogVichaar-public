require('dotenv').config();

const nodemailer = require('nodemailer');
const path = require('path');
const emailSender = require('../services/mailer');

async function run() {
  // If no MAIL/APPPASS configured, use Ethereal to simulate sending
  if (!process.env.MAIL || !process.env.APPPASS) {
    console.log('No MAIL/APPPASS found. Using Ethereal test account (no real email will be sent).');
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log('Ethereal account created. user:', testAccount.user);

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `Test <${testAccount.user}>`,
        to: testAccount.user,
        subject: 'Ethereal test: mailer check',
        text: 'This is a test message from test-mailer.js',
        html: '<p>This is a <strong>test</strong> message from test-mailer.js</p>',
      });

      console.log('Message sent. MessageId:', info.messageId);
      console.log('Preview URL (open in browser):', nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.error('Ethereal send failed:', err);
      process.exitCode = 1;
    }
  } else {
    // MAIL/APPPASS exist — call your emailSender (will attempt to send real email)
    const to = process.argv[2] || process.env.MAIL; // default to MAIL if no arg
    const otp = '123456';
    console.log(`Using real SMTP config. Sending test OTP to: ${to}`);
    try {
      const res = await emailSender(to, otp);
      console.log('emailSender returned:', res);
      console.log('Check the recipient inbox (and spam folder).');
    } catch (err) {
      console.error('emailSender threw an error:', err);
      process.exitCode = 1;
    }
  }
}

run();
