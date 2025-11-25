import mongoose from 'mongoose';
import Verification from '../Models/Verification.js';
import Process from '../Models/Process.js';

// CREATE Verification
export const createVerification = async (req, res) => {
  try {
    const { process, location, price } = req.body;

    if (!process || !location || price === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide process, location, and price' });
    }

    if (!mongoose.Types.ObjectId.isValid(process)) {
      return res.status(400).json({ success: false, message: 'Invalid process ID format' });
    }

    const processExists = await Process.findById(process);
    if (!processExists) {
      return res.status(404).json({ success: false, message: 'Process not found' });
    }

    const verification = new Verification({ process, location, price: Number(price) });
    await verification.save();

    return res.status(201).json({
      success: true,
      message: 'Verification created successfully',
      data: verification,
    });
  } catch (error) {
    console.error('Error creating verification:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET All Verifications
export const getVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find()
      .populate({
        path: 'process',
        populate: [{ path: 'client', select: 'name' }, { path: 'product', select: 'name' }],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: verifications.length,
      data: verifications,
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching verifications', error: error.message });
  }
};

// UPDATE Verification
export const updateVerification = async (req, res) => {
  const { id } = req.params;
  const { process, location, price } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid verification ID' });
  }

  try {
    const updatedVerification = await Verification.findByIdAndUpdate(
      id,
      { process, location, price },
      { new: true }
    );

    if (!updatedVerification) {
      return res.status(404).json({ success: false, message: 'Verification not found' });
    }

    return res.status(200).json({ success: true, message: 'Verification updated successfully', data: updatedVerification });
  } catch (error) {
    console.error('Error updating verification:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating verification', error: error.message });
  }
};

// DELETE Verification
export const deleteVerification = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid verification ID' });
  }

  try {
    const deleted = await Verification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Verification not found' });
    }

    return res.status(200).json({ success: true, message: 'Verification deleted successfully' });
  } catch (error) {
    console.error('Error deleting verification:', error);
    return res.status(500).json({ success: false, message: 'Server error while deleting verification', error: error.message });
  }
};
