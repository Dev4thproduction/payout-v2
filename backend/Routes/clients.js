import express from 'express';
import {
  getClients,
  addClient,
  updateClient,
  deleteClient,
} from '../controller/clientController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
router.get('/', getClients);

// @desc    Add new client
// @route   POST /api/clients
// @access  Private
router.post('/', addClient);

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
router.put('/:id', updateClient);

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
router.delete('/:id', deleteClient);

export default router;