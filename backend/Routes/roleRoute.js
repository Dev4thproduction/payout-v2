import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import {
    getRoles,
    addRole,
    getRoleByID,
    updateRole,
} from '../controller/roleController.js';

const router = express.Router();

// Route for fetching all roles
router.get('/', protect, getRoles);

// Route for adding a new role
router.post('/', protect, addRole);

// Route for fetching a role by ID
router.get('/:id', protect, getRoleByID);

// Route for updating a role
router.put('/:id', protect, updateRole);

export default router;
