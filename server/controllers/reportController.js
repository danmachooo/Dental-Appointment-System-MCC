const { Appointment, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

const reportController = {
  // Generate a monthly report
  async generateMonthlyReport(req, res) {
    try {
      const { month, year } = req.params;

      // Check for valid month and year
      if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < 2000 || year > new Date().getFullYear()) {
        return res.status(400).json({ error: 'Invalid month or year format.' });
      }

      const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
      const endDate = moment(startDate).endOf('month').toDate();

      // Fetch appointments for the given month/year
      const appointments = await Appointment.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }],
        attributes: ['id', 'status', 'date'], // Fetch only necessary attributes
      });

      // Appointment statistics
      const totalAppointments = appointments.length;
      const completedAppointments = appointments.filter(a => a.status === 'completed').length;
      const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
      const pendingAppointments = totalAppointments - (completedAppointments + cancelledAppointments);

      // Calculate percentages
      const completedPercentage = totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(2) : 0;
      const cancelledPercentage = totalAppointments > 0 ? ((cancelledAppointments / totalAppointments) * 100).toFixed(2) : 0;
      const pendingPercentage = totalAppointments > 0 ? ((pendingAppointments / totalAppointments) * 100).toFixed(2) : 0;

      const report = {
        month,
        year,
        totalAppointments,
        completedAppointments,
        completedPercentage,
        cancelledAppointments,
        cancelledPercentage,
        pendingAppointments,
        pendingPercentage,
        appointments
      };

      res.json(report);
    } catch (error) {
      console.error('Error generating monthly report:', error);
      res.status(500).json({ error: 'Internal server error. Could not generate report.' });
    }
  }
};

module.exports = reportController;
