// routes/fixedAmountRoutes.js
import express from "express";
import {
  getCurrentFixedAmount,
  setFixedAmount,
  getFixedAmountHistory,
  updateFixedAmount,
  deleteFixedAmount,
} from "../controller/fixedAmountController.js";

const router = express.Router();

// Routes
router.get("/", getCurrentFixedAmount);        // Get current active fixed amount
router.post("/", setFixedAmount);             // Set or update fixed amount
router.get("/history", getFixedAmountHistory); // Get history
router.put("/:id", updateFixedAmount);        // Update by ID
router.delete("/:id", deleteFixedAmount);     // Deactivate by ID

export default router;
