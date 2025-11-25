import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import {
    getCustomers,
    addCustomer,
    updateCustomer,
} from '../controller/customerController.js';

const router = express.Router();

// Route for fetching all customers
router.get('/', protect, getCustomers);

// Route for adding a new customer
router.post('/', protect, addCustomer);

// Route for updating a customer
router.put('/:id', protect, updateCustomer);

export default router;
