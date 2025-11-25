import mongoose from 'mongoose'; 
import PayoutVerification from '../Models/PayoutVerification.js';
import Verification from '../Models/Verification.js';


class PayoutVerificationController {
  // =============================================
  // Create a new Payout Verification
  // =============================================
  static async createPayoutVerification(req, res) {
    try {
      const { verification, numCases, name, month } = req.body;

      // Validate input
      if (!verification || !numCases || !name || !month) {
        return res.status(400).json({
          success: false,
          message: 'Please provide verification, number of cases, name, and month'
        });
      }

      if (!mongoose.Types.ObjectId.isValid(verification)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification ID format'
        });
      }

      // Validate month format (YYYY-MM)
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(month)) {
        return res.status(400).json({
          success: false,
          message: 'Month must be in YYYY-MM format'
        });
      }

      // Check if verification exists
      const verificationExists = await Verification.findById(verification);
      if (!verificationExists) {
        return res.status(404).json({
          success: false,
          message: 'Verification not found'
        });
      }

      // Create and save payout verification
      const payout = new PayoutVerification({
        verification,
        numCases,
        name,
        month
      });

      await payout.save();

      return res.status(201).json({
        success: true,
        message: 'Payout verification created successfully',
        data: payout
      });
    } catch (error) {
      console.error('Error creating payout verification:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while creating payout verification',
        error: error.message
      });
    }
  }

  // =============================================
  // Get all Payout Verifications
  // =============================================
  static async getAllPayoutVerifications(req, res) {
    try {
      const { month } = req.query; // Optional month filter

      let query = {};
      if (month) {
        query.month = month;
      }

      const payouts = await PayoutVerification.find(query)
        .populate({
          path: 'verification',
          populate: {
            path: 'process',
            populate: [
              { path: 'client', select: 'name' },
              { path: 'product', select: 'name' }
            ]
          }
        })
        .sort({ month: -1, createdAt: -1 }); // Sort by month (newest first), then creation date

      return res.status(200).json({
        success: true,
        count: payouts.length,
        data: payouts
      });
    } catch (error) {
      console.error('Error fetching payout verifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching payout verifications',
        error: error.message
      });
    }
  }

  // =============================================
  // Update Payout Verification by ID
  // =============================================
  static async updatePayoutVerification(req, res) {
    const { id } = req.params;
    const { verification, numCases, name, month } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    try {
      // Validate month format if provided
      if (month) {
        const monthRegex = /^\d{4}-\d{2}$/;
        if (!monthRegex.test(month)) {
          return res.status(400).json({
            success: false,
            message: 'Month must be in YYYY-MM format'
          });
        }
      }

      const updateData = { verification, numCases, name };
      if (month) {
        updateData.month = month;
      }

      const updated = await PayoutVerification.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Payout verification not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Payout verification updated successfully',
        data: updated
      });
    } catch (error) {
      console.error('Error updating payout verification:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while updating payout verification',
        error: error.message
      });
    }
  }

  // =============================================
  // Delete Payout Verification by ID
  // =============================================
  static async deletePayoutVerification(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    try {
      const deleted = await PayoutVerification.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Payout verification not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Payout verification deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting payout verification:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while deleting payout verification',
        error: error.message
      });
    }
  }

  // =============================================
  // Get Payout Verifications by Month
  // =============================================
  static async getPayoutVerificationsByMonth(req, res) {
    const { month } = req.params;

    // Validate month format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in YYYY-MM format'
      });
    }

    try {
      const payouts = await PayoutVerification.find({ month })
        .populate({
          path: 'verification',
          populate: {
            path: 'process',
            populate: [
              { path: 'client', select: 'name' },
              { path: 'product', select: 'name' }
            ]
          }
        })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: payouts.length,
        data: payouts
      });
    } catch (error) {
      console.error('Error fetching payout verifications by month:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching payout verifications by month',
        error: error.message
      });
    }
  }
}

export default PayoutVerificationController;