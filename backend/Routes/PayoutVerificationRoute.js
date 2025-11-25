import express from 'express'
const router = express.Router();
import PayoutVerificationController from '../controller/payOutVerification.js';
// =============================================
// POST - Create a new Payout Verification
// =============================================
router.post('/', PayoutVerificationController.createPayoutVerification);

// =============================================
// GET - Get all Payout Verifications
// =============================================
router.get('/', PayoutVerificationController.getAllPayoutVerifications);

// =============================================
// PUT - Update Payout Verification by ID
// =============================================
router.put('/:id', PayoutVerificationController.updatePayoutVerification);

// =============================================
// DELETE - Delete Payout Verification by ID
// =============================================
router.delete('/:id', PayoutVerificationController.deletePayoutVerification);

// =============================================
// GET - Get Payout Verifications by Month
// =============================================
router.get('/by-month/:month', PayoutVerificationController.getPayoutVerificationsByMonth);

export default router