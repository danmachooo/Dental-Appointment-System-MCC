const { Service } = require('../models');
const { Op } = require('sequelize');

const serviceController = {
  // Create a new service
  async createService(req, res) {
    try {
      const { name, description, duration, price } = req.body;

      // Validate required fields
      if (!name || !description || !duration || !price) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Validate that price is a number and duration is a valid time format
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
      }

      if (isNaN(duration) || duration <= 0) {
        return res.status(400).json({ message: 'Duration must be a positive number' });
      }

      // Create service
      const service = await Service.create({ name, description, duration, price });

      // Return the created service object
      res.status(201).json(service);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the service' });
    }
  },

  // Get all services
  async getAllServices(req, res) {
    try {
      const services = await Service.findAll();

      if (!services || services.length === 0) {
        return res.status(404).json({ message: 'No services found' });
      }

      res.status(200).json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving services' });
    }
  },

  // Get a service by ID
  async getServiceById(req, res) {
    try {
      const service = await Service.findByPk(req.params.id);
      
      if (service) {
        res.status(200).json(service);
      } else {
        res.status(404).json({ message: 'Service not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving the service' });
    }
  },

  // Update a service
  async updateService(req, res) {
    try {
      const { name, description, duration, price } = req.body;
      
      // Validate input
      if (!name && !description && !duration && !price) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }

      // Check for valid price and duration if provided
      if (price && (isNaN(price) || price <= 0)) {
        return res.status(400).json({ message: 'Price must be a positive number' });
      }

      if (duration && (isNaN(duration) || duration <= 0)) {
        return res.status(400).json({ message: 'Duration must be a positive number' });
      }

      const [updated] = await Service.update(req.body, {
        where: { id: req.params.id }
      });

      if (updated) {
        const updatedService = await Service.findByPk(req.params.id);
        res.status(200).json(updatedService);
      } else {
        res.status(404).json({ message: 'Service not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the service' });
    }
  },

  // Delete a service
  async deleteService(req, res) {
    try {
      const deleted = await Service.destroy({
        where: { id: req.params.id }
      });

      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Service not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the service' });
    }
  }
};

module.exports = serviceController;
