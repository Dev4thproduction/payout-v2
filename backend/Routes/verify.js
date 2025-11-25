import express from 'express';
import {
  createVerification,
  getVerifications,
  updateVerification,
  deleteVerification,
} from '../controller/verificationController.js';

const router = express.Router();

router.post('/', createVerification);
router.get('/', getVerifications);
router.put('/:id', updateVerification);
router.delete('/:id', deleteVerification);

export default router;
