const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const appointmentController = require('../controllers/appointmentController');

// Get available appointment slots
router.get('/available-slots', authMiddleware, appointmentController.getAvailableSlots);

// Book an appointment
router.post('/book', 
  authMiddleware,
  [
    body('appointmentId').isInt(),
    body('serviceId').isInt(),
  ],
  validate,
  appointmentController.bookAppointment
);

// Get patient's appointments
router.get('/appointments', authMiddleware, appointmentController.getPatientAppointments);

// Cancel an appointment
router.post('/cancel/:id', authMiddleware, appointmentController.cancelAppointment);

module.exports = router;