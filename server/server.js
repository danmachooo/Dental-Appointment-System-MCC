const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const { scheduleAppointmentReminders } = require('./utils/notificationSystem');
require('dotenv').config();

const loggingMiddleware = require('./middleware/loggingMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggingMiddleware);

// Import routes
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const dentistRoutes = require('./routes/dentistRoutes');
const patientRoutes = require('./routes/patientRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dentist', dentistRoutes);
app.use('/api/patient', patientRoutes);

// Error handling middleware
app.use(errorHandler);

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    scheduleAppointmentReminders();
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});

module.exports = app;