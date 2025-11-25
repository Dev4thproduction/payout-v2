import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import {
    login,
    addUser,
    getUsers,
    updateUser,
    changePassword,
    removeCustomerFromUser,
    addCustomerInUser,
    resetDeviceID,
    getUserByID,
    updateFCMToken,
    forceLogoutUser,
    forceLogoutMultipleUsers,
    getForceLogoutHistory,
    blacklistCurrentToken,
    getSupervisors,
    getTeamMembers
} from '../controller/userController.js'

const router = express.Router();

// Route for user login
router.post('/login', login);

// Route for adding a new user
router.post('/', protect, addUser);

// Route for getting all users
router.get('/', protect, getUsers);

// Route for getting supervisors only
router.get('/supervisors/list', protect, getSupervisors);

// Route for getting team members (non-supervisors, non-admins)
router.get('/team-members/list', protect, getTeamMembers);

// Route for getting user by ID
router.get('/:id', protect, getUserByID);

// Route for updating user
router.put('/:id', protect, updateUser);

// Route for changing password
router.put('/reset-password/:id', protect, changePassword);

// Route for adding customer to user
router.put('/add-customer/:id', protect, addCustomerInUser);

// Route for removing customer from user
router.put('/remove-customer/:id', protect, removeCustomerFromUser);

// Route for resetting device ID
router.put('/reset-device-id/:id', protect, resetDeviceID);

// Route for updating FCM token
router.post('/updateFCMToken', protect, updateFCMToken);

// Force logout routes
router.put('/force-logout/:id', protect, forceLogoutUser);
router.put('/force-logout-multiple', protect, forceLogoutMultipleUsers);
router.get('/force-logout-history', protect, getForceLogoutHistory);
router.post('/logout', protect, blacklistCurrentToken);

export default router;