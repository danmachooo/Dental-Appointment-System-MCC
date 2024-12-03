const { Appointment, User, Service } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

const appointmentController = {
  // Create a new appointment
  async createAppointment(req, res) {
    try {
      const { date, time, service, UserId } = req.body;

      // Validate required fields
      if (!date || !time || !service || !UserId) {
        return res.status(400).json({ error: 'Date, time, service, and UserId are required.' });
      }

      // Validate date format
      if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      }

      const appointment = await Appointment.create({ date, time, service, UserId });
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all appointments
  async getAllAppointments(req, res) {
    try {
      const appointments = await Appointment.findAll({
        include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
      });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get appointment by ID
  async getAppointmentById(req, res) {
    try {
      const appointment = await Appointment.findByPk(req.params.id, {
        include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
      });
      if (appointment) {
        res.json(appointment);
      } else {
        res.status(404).json({ message: 'Appointment not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update appointment
  async updateAppointment(req, res) {
    try {
      const [updated] = await Appointment.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedAppointment = await Appointment.findByPk(req.params.id);
        res.json(updatedAppointment);
      } else {
        res.status(404).json({ message: 'Appointment not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete appointment
  async deleteAppointment(req, res) {
    try {
      const deleted = await Appointment.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        res.status(204).json({ message: 'Appointment deleted' });
      } else {
        res.status(404).json({ message: 'Appointment not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Set dentist's availability
  async setAvailability(req, res) {
    try {
      const { availabilities } = req.body;
      const dentistId = req.user.id;

      // Validate that availabilities are provided
      if (!availabilities || !Array.isArray(availabilities)) {
        return res.status(400).json({ error: 'Availabilities must be an array of date-time slots.' });
      }

      const createdAvailabilities = await Promise.all(
        availabilities.map(async (slot) => {
          if (!moment(slot.date, 'YYYY-MM-DD', true).isValid() || !slot.time) {
            throw new Error('Invalid date or time format for availability slot.');
          }

          return Appointment.create({
            date: slot.date,
            time: slot.time,
            UserId: dentistId,
            status: 'available'
          });
        })
      );

      res.status(201).json(createdAvailabilities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get dentist's appointments
  async getDentistAppointments(req, res) {
    try {
      const dentistId = req.user.id;
      const appointments = await Appointment.findAll({
        where: { UserId: dentistId },
        include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
      });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get patient's appointments
  async getPatientAppointments(req, res) {
    try {
      const patientId = req.user.id;
      const appointments = await Appointment.findAll({
        where: { UserId: patientId },
        include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
      });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Book an appointment
  async bookAppointment(req, res) {
    try {
      const { appointmentId, serviceId } = req.body;
      const patientId = req.user.id;

      const appointment = await Appointment.findByPk(appointmentId);
      if (!appointment || appointment.status !== 'available') {
        return res.status(400).json({ message: 'Invalid or unavailable appointment slot' });
      }

      const service = await Service.findByPk(serviceId);
      if (!service) {
        return res.status(400).json({ message: 'Service not found' });
      }

      appointment.UserId = patientId;
      appointment.ServiceId = serviceId;
      appointment.status = 'scheduled';
      await appointment.save();

      res.status(200).json(appointment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Cancel appointment
  async cancelAppointment(req, res) {
    try {
      const appointmentId = req.params.id;
      const patientId = req.user.id;

      const appointment = await Appointment.findOne({
        where: { id: appointmentId, UserId: patientId }
      });

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      appointment.status = 'cancelled';
      await appointment.save();

      res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get available slots for a specific date
  async getAvailableSlots(req, res) {
    try {
      const { date } = req.query;

      // Validate the date format
      if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      }

      const availableSlots = await Appointment.findAll({
        where: {
          date,
          status: 'available'
        },
        include: [{ model: User, attributes: ['firstName', 'lastName'] }]
      });

      res.json(availableSlots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = appointmentController;
