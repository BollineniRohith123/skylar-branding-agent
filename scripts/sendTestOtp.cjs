#!/usr/bin/env node
/**
 * Simple SMTP test script (CommonJS)
 * Sends a 6-digit OTP to the recipient using SMTP credentials from .env
 * Usage: node ./scripts/sendTestOtp.cjs recipient@example.com
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function main() {
  const to = process.argv[2] || process.env.SMTP_USER;
  if (!to) {
    console.error('Recipient email required as first argument or SMTP_USER in .env');
    process.exit(1);
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = (process.env.SMTP_SECURE || 'true') === 'true';
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass) {
    console.error('SMTP_HOST, SMTP_USER and SMTP_PASS must be set in .env');
    process.exit(1);
  }

  const otp = generateOtp();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject: 'Your verification code (test)',
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  });

  console.log('Message sent:', info.messageId || info.response);
  console.log('OTP (for testing):', otp);
  process.exit(0);
}

main().catch(err => {
  console.error('Failed to send test OTP:', err && err.message ? err.message : err);
  process.exit(1);
});
