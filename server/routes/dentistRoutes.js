const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const appointmentController = require('../controllers/appointmentController');
const serviceController = require('../controllers/serviceController');
const reportController = require('../controllers/reportController');

// Set available time slots
router.post('/availability', 
  authMiddleware,
  [
    body('availabilities').isArray(),
    body('availabilities.*.date').isDate(),
    body('availabilities.*.time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
  ],
  validate,
  appointmentController.setAvailability
);

// Get all appointments for dentist
router.get('/appointments', authMiddleware, appointmentController.getDentistAppointments);

// Generate monthly report
router.get('/report/:year/:month', authMiddleware, reportController.generateMonthlyReport);

// Service management
router.post('/services', authMiddleware, serviceController.createService);
router.get('/services', authMiddleware, serviceController.getAllServices);
router.put('/services/:id', authMiddleware, serviceController.updateService);
router.delete('/services/:id', authMiddleware, serviceController.deleteService);

module.exports = router;