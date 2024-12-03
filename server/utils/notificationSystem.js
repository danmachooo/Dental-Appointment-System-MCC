const schedule = require('node-schedule');
const { Appointment, User } = require('../models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer (you'll need to set up your email service)
const transporter = nodemailer.createTransport({
  // ... your email configuration
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS,
  }
});

const scheduleAppointmentReminders = async () => {
  // Schedule job to run daily
  schedule.scheduleJob('0 0 * * *', async function() {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const appointments = await Appointment.findAll({
      where: {
        date: threeDaysFromNow,
        status: 'scheduled'
      },
      include: [{ model: User, attributes: ['email', 'firstName', 'lastName'] }]
    });

    for (const appointment of appointments) {
      const mailOptions = {
        from: 'Dental Appointment System',
        to: appointment.User.email,
        subject: 'Appointment Reminder',
        text: `Dear ${appointment.User.firstName}, this is a reminder that you have an appointment scheduled on ${appointment.date} at ${appointment.time}.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
  });
};
module.exports = { scheduleAppointmentReminders };