const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Task Manager <your-email@gmail.com>',
      to: email,
      subject: subject,
      html: text
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

module.exports = sendEmail;

